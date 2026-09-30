/**
 * Hanging ID Card Physics Engine — 2D Ball-on-a-Strap Simulation
 * 
 * Mental Model:
 * A weighted ball (the card) tied to a flexible strap hanging from the ceiling in 2D.
 * 
 * Features:
 * - Slight Diagonal Free-Fall Drop: On page load, the card falls from above the page in a subtle
 *   diagonal direction (not laser-straight), enters the viewport, and accelerates under gravity.
 * - Realistic Strap Tension & Little Bounce: When the strap reaches full extension (240px),
 *   tension snaps taut, arrests the fall, and rebounds with an authentic "little bounce" as in real life.
 * - Soft, Smooth Cursor Reaction: Softly touching the strap or card produces a gentle, subtle reaction.
 *   NO vibration, jitter, or violent shaking when moving slowly.
 * - Grabbing & Throwing from/to any point: Dragging anywhere maintains exact offset; lifting up folds the strap
 *   with zero card tilt; throwing releases the ball along its 2D ballistic trajectory.
 */

export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  subtractNew(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }
}

export class Particle {
  constructor({ x, y, pinned = false, id = 0 }) {
    this.pos = new Vec2(x, y);
    this.oldPos = new Vec2(x, y);
    this.velocity = new Vec2(0, 0);
    this.acceleration = new Vec2(0, 0);
    this.pinned = pinned;
    this.id = id;
  }

  update(damping, gravity) {
    if (this.pinned) {
      this.acceleration.reset(0, 0);
      return;
    }

    // Verlet integration: velocity from (pos - oldPos) * damping
    this.velocity.reset(
      (this.pos.x - this.oldPos.x) * damping,
      (this.pos.y - this.oldPos.y) * damping
    );

    this.oldPos.reset(this.pos.x, this.pos.y);

    // Continuous downward gravity
    this.acceleration.y += gravity;

    // Position step
    this.pos.x += this.velocity.x + this.acceleration.x;
    this.pos.y += this.velocity.y + this.acceleration.y;

    this.acceleration.reset(0, 0);
  }

  applyForce(f) {
    if (!this.pinned) {
      this.acceleration.x += f.x;
      this.acceleration.y += f.y;
    }
  }
}

export class Constraint {
  constructor({ p1, p2, length }) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
    this.minLength = 2;       // Can fold/slack freely
    this.maxLength = length;  // Rest length (48px)
  }

  solve() {
    const dx = this.p2.pos.x - this.p1.pos.x;
    const dy = this.p2.pos.y - this.p1.pos.y;
    const distance = Math.hypot(dx, dy);

    // Guard against divide by zero
    if (distance < 0.001) return;

    // Slack-capable constraint (Love Strings model)
    let targetLength = this.length;
    if (distance > this.maxLength) {
      targetLength = this.maxLength;
    } else if (distance < this.minLength) {
      targetLength = this.minLength;
    } else {
      return; // Slack: strap folds freely
    }

    const difference = (targetLength - distance) / distance;
    const percent = difference * 0.45;

    const offsetX = dx * percent;
    const offsetY = dy * percent;

    if (this.p1.pinned && !this.p2.pinned) {
      this.p2.pos.x += offsetX * 2;
      this.p2.pos.y += offsetY * 2;
    } else if (!this.p1.pinned && this.p2.pinned) {
      this.p1.pos.x -= offsetX * 2;
      this.p1.pos.y -= offsetY * 2;
    } else if (!this.p1.pinned && !this.p2.pinned) {
      this.p1.pos.x -= offsetX;
      this.p1.pos.y -= offsetY;
      this.p2.pos.x += offsetX;
      this.p2.pos.y += offsetY;
    }
  }
}

export const DEFAULT_PHYSICS_CONFIG = {
  // Downward gravity
  gravity: 0.42,

  // Velocity damping per frame (natural inertia & settling)
  damping: 0.988,

  // Constraint relaxation iterations per frame
  iterationsPerFrame: 8,

  // Default strap dimensions
  strapSegmentLength: 48,
  strapContactRadius: 24,

  // Card dimensions for wake contact
  cardHalfWidth: 135,
  cardHeight: 405,

  // Ultra-gentle, soft interaction multipliers (barely moves on slow cursor sweep)
  strapPushForce: 0.18,
  cardPushForce: 0.05,
  maxCardPush: 1.8,
  maxThrowSpeed: 20.0,

  // Desired resting position of the card clip in container coordinates
  targetRestY: 210,
  // Number of strap segments for smooth Bezier curve
  segmentCount: 7
};

export class HangingCardSimulation {
  constructor(anchorX, anchorY = -135, config = {}) {
    this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config };
    this.anchor = { x: anchorX, y: anchorY };
    this.targetRestY = this.config.targetRestY;
    this.segmentCount = this.config.segmentCount;

    // Rest length of the entire lanyard strap: distance from ceiling anchor to resting Y
    this.restLength = Math.max(160, this.targetRestY - this.anchor.y);
    this.segmentLength = this.restLength / this.segmentCount;

    this.particles = [];
    this.constraints = [];
    this.strapParticles = [];

    // Cursor tracking
    this.cursorPos = new Vec2(anchorX, this.targetRestY + 100);
    this.prevCursorPos = new Vec2(anchorX, this.targetRestY + 100);
    this.cursorVelocity = new Vec2(0, 0);

    // Drag & throw state
    this.isDragging = false;
    this.draggedParticle = null;
    this.dragOffset = new Vec2(0, 0);
    this.throwHistory = [];

    // Initial slight diagonal free-fall drop state with high, prominent bounce (NO vibration)
    this.isDropping = true;
    this.dropFrames = 0;
    this.dropReboundPhase = 0; // 0 = free fall & catch, 1 = high upward bounce arc, 2 = soft cushion settle
    this.dropX = anchorX + 26; // slight diagonal offset (~4° off vertical)
    this.dropOldX = this.dropX + 0.6; // subtle natural inward drift
    
    // Starts completely out of the screen (above the top ceiling of the browser viewport)
    // Card height is 405px. At dropY <= anchor.y - 450 (or <= -620), the entire card is off-screen.
    this.dropY = Math.min(-620, this.anchor.y - 450);
    this.dropOldY = this.dropY - 14.0; // downward initial velocity
    this.dropTaut = false;

    // 3D perspective roll/pitch
    this.tiltY = 0;
    this.tiltX = 0;

    this.time = 0;

    this.initSystem();
  }

  /**
   * Initializes the particle chain.
   */
  initSystem() {
    const ax = this.anchor.x;
    const ay = this.anchor.y;
    const numSegments = this.segmentCount;

    this.particles = [];
    this.constraints = [];
    this.strapParticles = [];

    // P0: Top ceiling anchor pinned above the page
    const p0 = new Particle({ x: ax, y: ay, pinned: true, id: 0 });
    this.particles.push(p0);
    this.strapParticles.push(p0);

    // Initial position along the drop vector for intermediate joints
    for (let i = 1; i < numSegments; i++) {
      const t = i / numSegments;
      const px = ax + t * (this.dropX - ax);
      const py = ay + t * (this.dropY - ay);
      const p = new Particle({
        x: px,
        y: py,
        pinned: false,
        id: i
      });
      this.particles.push(p);
      this.strapParticles.push(p);
    }

    // Last particle: The Ball (card attachment clip)
    const pCard = new Particle({
      x: this.dropX,
      y: this.dropY,
      pinned: false,
      id: numSegments
    });
    this.particles.push(pCard);
    this.strapParticles.push(pCard);

    this.cardClip = pCard;

    // Constraints along each segment
    for (let i = 0; i < numSegments; i++) {
      this.constraints.push(
        new Constraint({
          p1: this.strapParticles[i],
          p2: this.strapParticles[i + 1],
          length: this.segmentLength
        })
      );
    }
  }

  /**
   * The ball's position (P5). The card is translated to this point.
   */
  get pos() {
    return {
      x: this.cardClip.pos.x,
      y: this.cardClip.pos.y
    };
  }

  /**
   * The card orientation:
   * - During slight diagonal drop: tilts gently in line with trajectory.
   * - During dragging: stays upright if lifted vertically; subtle anchor tilt if pulled sideways.
   * - During free swing: sways naturally with pendulum displacement and velocity.
   * - At resting equilibrium: settles at 0.00°.
   */
  get angle() {
    if (this.isDropping) {
      const dx = this.cardClip.pos.x - this.anchor.x;
      const dy = Math.max(100, this.cardClip.pos.y - this.anchor.y);
      return Math.atan2(dx, dy) * 0.55;
    }

    const dx = this.cardClip.pos.x - this.anchor.x;
    const dy = Math.max(100, this.cardClip.pos.y - this.anchor.y);
    const pendulumAngle = Math.atan2(dx, dy);

    if (this.isDragging) {
      return pendulumAngle * 0.35;
    }

    // Free swing: pendulum angle + dynamic velocity sway
    const velX = this.cardClip.pos.x - this.cardClip.oldPos.x;
    const dynamicSway = Math.max(-0.25, Math.min(0.25, velX * 0.018));
    const combined = pendulumAngle * 0.65 + dynamicSway;

    return Math.max(-0.44, Math.min(0.44, combined));
  }

  /**
   * Updates top anchor point on resize without re-triggering the drop.
   */
  setAnchor(x, y) {
    const dx = x - this.anchor.x;
    this.anchor.x = x;
    if (y !== undefined) {
      this.anchor.y = y;
      this.restLength = Math.max(160, this.targetRestY - this.anchor.y);
      this.segmentLength = this.restLength / this.segmentCount;

      for (const con of this.constraints) {
        con.length = this.segmentLength;
        con.maxLength = this.segmentLength;
      }
    }

    this.particles[0].pos.reset(this.anchor.x, this.anchor.y);
    this.particles[0].oldPos.reset(this.anchor.x, this.anchor.y);

    for (let i = 1; i < this.particles.length; i++) {
      this.particles[i].pos.x += dx;
      this.particles[i].oldPos.x += dx;
    }
  }

  /**
   * Registers cursor movement and handles active dragging.
   */
  updateCursor(x, y) {
    const dx = x - this.cursorPos.x;
    const dy = y - this.cursorPos.y;

    this.cursorVelocity.reset(dx, dy);
    this.prevCursorPos.reset(this.cursorPos.x, this.cursorPos.y);
    this.cursorPos.reset(x, y);

    if (this.isDragging && this.draggedParticle) {
      const targetX = x - this.dragOffset.x;
      const targetY = Math.max(this.anchor.y + 20, y - this.dragOffset.y);

      const vx = targetX - this.draggedParticle.pos.x;
      const vy = targetY - this.draggedParticle.pos.y;

      // Keep recent samples for natural throw momentum
      const now = performance.now();
      this.throwHistory.push({ vx, vy, time: now });
      if (this.throwHistory.length > 5) {
        this.throwHistory.shift();
      }

      this.draggedParticle.pos.reset(targetX, targetY);
      this.draggedParticle.oldPos.reset(targetX, targetY);
    }
  }

  /**
   * Grabs the ball (card) or strap when clicked.
   */
  startDrag(clientX, clientY) {
    // If grabbed during initial drop, immediately transition to interactive physics
    this.isDropping = false;
    this.isDragging = true;
    this.throwHistory = [];

    // Find the closest non-pinned particle (card or strap)
    let closest = this.cardClip;
    let minDist = Infinity;

    for (const p of this.particles) {
      if (p.pinned) continue;
      const d = Math.hypot(clientX - p.pos.x, clientY - p.pos.y);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    }

    this.draggedParticle = closest;
    this.dragOffset.reset(
      clientX - this.draggedParticle.pos.x,
      clientY - this.draggedParticle.pos.y
    );
  }

  /**
   * Releases dragged particle, transferring momentum into fluid 2D throw.
   */
  stopDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.draggedParticle) {
      const now = performance.now();
      const recent = this.throwHistory.filter(h => now - h.time < 120);

      let avgVx = 0;
      let avgVy = 0;
      if (recent.length > 0) {
        for (const h of recent) {
          avgVx += h.vx;
          avgVy += h.vy;
        }
        avgVx /= recent.length;
        avgVy /= recent.length;
      } else {
        avgVx = this.cursorVelocity.x;
        avgVy = this.cursorVelocity.y;
      }

      const maxThrow = this.config.maxThrowSpeed;
      const speed = Math.hypot(avgVx, avgVy);
      if (speed > maxThrow) {
        avgVx = (avgVx / speed) * maxThrow;
        avgVy = (avgVy / speed) * maxThrow;
      }

      this.draggedParticle.oldPos.reset(
        this.draggedParticle.pos.x - avgVx * 0.9,
        this.draggedParticle.pos.y - avgVy * 0.9
      );

      this.draggedParticle = null;
      this.throwHistory = [];
    }
  }

  /**
   * Applies aerodynamic drag and inertial wake forces when the user scrolls the page.
   * Features a progressive deadzone: slow scrolls produce negligible movement (< 1.2px/frame is 0);
   * brisk scrolls produce a restrained, subtle tilt and gentle flutter.
   */
  applyScrollDrag(scrollSpeed) {
    if (this.isDropping || this.isDragging) return;

    const absSpeed = Math.abs(scrollSpeed);
    // Deadzone: slow, reading scroll produces zero/negligible reaction
    if (absSpeed < 1.2) return;

    // Progressive quadratic response curve: slow scrolls produce near-zero displacement
    const speedScale = Math.pow(Math.min(1.0, (absSpeed - 1.2) / 5.5), 2.2);
    const dir = Math.sign(scrollSpeed);
    const effectiveSpeed = dir * speedScale * 1.8;

    // Very gentle vertical aerodynamic lift (no jerky jumps)
    const dragY = -effectiveSpeed * 0.35;

    // Toned-down subtle flutter (subtle, card does NOT swing wildly)
    const flutter = Math.sin(this.time * 2.5) * 0.08;
    const dragX = effectiveSpeed * flutter;

    // Restrained pitch tilt (max ±7° for subtle, elegant realism)
    this.tiltX += effectiveSpeed * 0.75;
    this.tiltX = Math.max(-7.0, Math.min(7.0, this.tiltX));

    // Microscopic yaw sway
    this.tiltY += dragX * 0.5;
    this.tiltY = Math.max(-4.0, Math.min(4.0, this.tiltY));

    // Apply modest force to the card attachment clip
    this.cardClip.applyForce(new Vec2(dragX, dragY));

    // Gentle force on lower strap
    const n = this.strapParticles.length;
    if (n >= 4) {
      this.strapParticles[n - 2].applyForce(new Vec2(dragX * 0.2, dragY * 0.15));
    }
  }

  /**
   * Main simulation step called per animation frame.
   */
  step(dt = 1.0) {
    this.time += 0.016;
    const c = this.config;
    const restLen = this.restLength;
    const numSegments = this.segmentCount;

    // -------------------------------------------------------------------------
    // 0. SLIGHT DIAGONAL FREE-FALL DROP & HIGH ELASTIC BOUNCE SEQUENCE
    // -------------------------------------------------------------------------
    if (this.isDropping) {
      this.dropFrames = (this.dropFrames || 0) + 1;
      const vx = (this.dropX - this.dropOldX) * 0.988;
      const vy = (this.dropY - this.dropOldY) * 0.988;
      this.dropOldX = this.dropX;
      this.dropOldY = this.dropY;

      const dx = this.dropX - this.anchor.x;
      const dy = this.dropY - this.anchor.y;
      const dist = Math.hypot(dx, dy);

      if (!this.dropTaut) {
        // Free fall accelerating downwards in a subtle natural diagonal
        this.dropX += vx;
        this.dropY += vy + 0.58;

        // When distance reaches full strap rest length, tension snaps taut!
        if (dist >= restLen) {
          this.dropTaut = true;
        }
      } else {
        const stretch = dist - restLen;
        const normX = dx / dist;
        const normY = dy / dist;
        const radialVel = vx * normX + vy * normY;

        if (this.dropReboundPhase === 0) {
          // Catch phase: decelerate downward plunge and launch high, prominent rebound
          const tension = -stretch * 0.30 - radialVel * 0.18;
          this.dropX += vx + tension * normX;
          this.dropY += vy + 0.58 + tension * normY;

          const curVy = this.dropY - this.dropOldY;
          if (curVy < 0) {
            // Turnaround reached! Launch powerful upward bounce (-11.5 px/frame)
            this.dropOldY = this.dropY - (-11.5);
            this.dropReboundPhase = 1;
          }
        } else if (this.dropReboundPhase === 1) {
          // High upward bounce arc under gravity
          const pendulumFx = -(this.dropX - this.anchor.x) * 0.012;
          this.dropX += vx + pendulumFx;
          this.dropY += vy + 0.52; // gravity decelerates ascent and pulls card back down

          const curVy = this.dropY - this.dropOldY;
          if (curVy > 0 && dist >= restLen) {
            // Second landing: soft natural cushion (no secondary vibration)
            this.dropReboundPhase = 2;
            this.dropOldY = this.dropY - (curVy * -0.20);
          }
        } else if (this.dropReboundPhase === 2) {
          // Soft cushion settling directly to resting equilibrium
          const pendulumFx = -(this.dropX - this.anchor.x) * 0.015;
          const tension = -stretch * 0.55 - radialVel * 0.65;
          this.dropX += vx + pendulumFx + tension * normX;
          this.dropY += vy + 0.45 + tension * normY;

          const curVy = this.dropY - this.dropOldY;
          if ((Math.abs(curVy) < 0.35 && Math.abs(dist - restLen) < 2.5) || this.dropFrames > 130) {
            this.isDropping = false;
          }
        }
      }

      // Synchronize card clip particle
      this.cardClip.pos.reset(this.dropX, this.dropY);
      this.cardClip.oldPos.reset(this.dropOldX, this.dropOldY);

      // Strap particles connect smoothly from anchor to the falling/bouncing card
      for (let i = 1; i < numSegments; i++) {
        const t = i / numSegments;
        let px = this.anchor.x + t * (this.dropX - this.anchor.x);
        let py = this.anchor.y + t * (this.dropY - this.anchor.y);
        
        // Gentle organic ribbon bow while falling before taut
        if (!this.dropTaut) {
          px += Math.sin(t * Math.PI) * 4;
        } else if (dist < restLen) {
          // Strap slack when card rebounds upward in the bounce
          const slack = Math.min(22, (restLen - dist) * 0.35);
          px += Math.sin(t * Math.PI) * slack;
        }

        this.strapParticles[i].pos.reset(px, py);
        this.strapParticles[i].oldPos.reset(px, py);
      }

      this.tiltY = 0;
      this.tiltX = 0;
      return;
    }

    // -------------------------------------------------------------------------
    // 1. SOFT & REALISTIC CONTACT FORCES (NO VIBRATION)
    // -------------------------------------------------------------------------
    if (!this.isDragging) {
      const cvx = this.cursorVelocity.x;
      const cvy = this.cursorVelocity.y;

      const cursorSpeed = Math.hypot(cvx, cvy);
      // Progressive deadzone response: slow movement (< 3px/frame) produces near-zero movement;
      // only faster swipes produce noticeable reactive wake.
      const strapSpeedScale = Math.pow(Math.min(1.0, Math.max(0, (cursorSpeed - 1.0) / 6.0)), 2.0);
      const cardSpeedScale = Math.pow(Math.min(1.0, Math.max(0, (cursorSpeed - 1.2) / 7.0)), 2.2);

      // A) Moving cursor through the Strap (Particles 1 to numSegments - 1)
      for (let i = 1; i < numSegments; i++) {
        const p = this.strapParticles[i];
        const dist = Math.hypot(this.cursorPos.x - p.pos.x, this.cursorPos.y - p.pos.y);

        if (dist < c.strapContactRadius) {
          const contactWeight = 1 - dist / c.strapContactRadius;
          const fx = cvx * c.strapPushForce * contactWeight * strapSpeedScale;
          const fy = cvy * c.strapPushForce * 0.12 * contactWeight * strapSpeedScale;

          p.applyForce(new Vec2(fx, fy));
        }
      }

      // B) Moving cursor through the Ball (Card body)
      // Slow sweeps produce negligible displacement (< 0.5px), soft touch reaction
      const pClip = this.cardClip.pos;
      const insideCardX = Math.abs(this.cursorPos.x - pClip.x) <= c.cardHalfWidth;
      const insideCardY = this.cursorPos.y >= pClip.y && this.cursorPos.y <= pClip.y + c.cardHeight;

      if (insideCardX && insideCardY) {
        let fx = cvx * c.cardPushForce * cardSpeedScale;
        let fy = cvy * c.cardPushForce * 0.1 * cardSpeedScale;

        const mag = Math.hypot(fx, fy);
        if (mag > c.maxCardPush) {
          fx = (fx / mag) * c.maxCardPush;
          fy = (fy / mag) * c.maxCardPush;
        }

        this.cardClip.applyForce(new Vec2(fx, fy));
      }
    }

    // -------------------------------------------------------------------------
    // 2. VERLET PARTICLES UPDATE (VELOCITY DAMPING + GRAVITY)
    // -------------------------------------------------------------------------
    for (const p of this.particles) {
      if (this.isDragging && p === this.draggedParticle) {
        continue;
      }
      p.update(c.damping, c.gravity);
    }

    // -------------------------------------------------------------------------
    // 3. CONSTRAINTS RELAXATION (LOVE STRINGS TAUT/SLACK MODEL)
    // -------------------------------------------------------------------------
    for (let iter = 0; iter < c.iterationsPerFrame; iter++) {
      for (const con of this.constraints) {
        con.solve();
      }

      // Re-assert dragged particle position if dragging
      if (this.isDragging && this.draggedParticle) {
        const targetX = this.cursorPos.x - this.dragOffset.x;
        const targetY = Math.max(this.anchor.y + 20, this.cursorPos.y - this.dragOffset.y);
        this.draggedParticle.pos.reset(targetX, targetY);
      }
    }

    // -------------------------------------------------------------------------
    // 4. 3D PERSPECTIVE ROLL / PITCH (SUBTLE SHEEN)
    // -------------------------------------------------------------------------
    if (this.isDragging) {
      this.tiltY = 0;
      this.tiltX = 0;
    } else {
      const currentAngle = this.angle;
      const cardVelX = (this.cardClip.pos.x - this.cardClip.oldPos.x);
      const cardVelY = (this.cardClip.pos.y - this.cardClip.oldPos.y);

      const targetTiltY = Math.sin(currentAngle) * 6.0 + Math.max(-3, Math.min(3, cardVelX * 0.3));
      const targetTiltX = -Math.max(-4, Math.min(4, cardVelY * 0.2));

      this.tiltY += (targetTiltY - this.tiltY) * 0.12;
      this.tiltX += (targetTiltX - this.tiltX) * 0.12;
    }

    // Decay cursor velocity smoothly
    this.cursorVelocity.x *= 0.8;
    this.cursorVelocity.y *= 0.8;
  }

  /**
   * Generates a continuous SVG Bézier curve passing through all strap particles.
   */
  getStringPath() {
    const pts = this.strapParticles.map((p) => p.pos);
    const n = pts.length;
    if (n < 2) return '';

    // Safety check against any NaN
    if (isNaN(pts[0].x) || isNaN(pts[0].y)) return '';

    let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;

    for (let i = 0; i < n - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < n - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }

    return d;
  }
}

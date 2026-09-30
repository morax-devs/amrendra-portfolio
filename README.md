# Amrendra Singh — Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Editorial-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <b>Personal engineering portfolio and interactive systems showcase.</b><br>
  Built with a disciplined dark-editorial aesthetic, custom 2D Verlet physics, and high-performance scroll interactions.
</p>

</div>

---

## ✦ Overview

This portfolio showcases selected software engineering projects, hackathon initiatives, and technical domains. It diverges from generic portfolio templates by prioritizing **editorial typography, physical authenticity, and zero-dependency custom physics engines**.

### Key Highlights
- **Physical Hanging ID Badge**: A real-time 2D Verlet simulation of an accredited student badge suspended from the top ceiling of the browser.
- **Scroll Aerodynamic Drag**: Scrolling generates realistic fluid air resistance on the card face, creating subtle pitch tilts, micro-flutter, and natural pendulum settling.
- **Out-of-Screen Free Fall**: On page load, the card drops from above the browser window under gravity, snaps taut on its lanyard, and settles with an elastic rebound.
- **Terminal Cipher Unscramble**: Section index labels and headers decrypt with a cybernetic matrix wave as they scroll into view.
- **Laser-Drawn Experience Timeline**: A glowing electric-blue laser trace draws itself downward in real time, illuminating milestone nodes on contact.
- **Sticky Navbar Progress Hairline**: A 2px glowing gradient indicator tracks reading progress from 0% to 100%.

---

## ✦ Featured Projects

| Project | Domain | Stack | Description |
| :--- | :--- | :--- | :--- |
| **[Luma](https://github.com/morax-devs/Luma-learn-)** | Full Stack + AI | React, Node.js, MongoDB, JWT, AI | AI-integrated e-learning platform with course management, secure authentication, and interactive educational workflows. |
| **[BobForge](https://github.com/morax-devs/bobforge)** | Multi-Agent Systems | Python, LangGraph, Docker, AI | Autonomous coding workflow pipeline utilizing iterative generation, linting, testing, and sandboxed Docker execution. |
| **[Web Scraper](https://github.com/morax-devs/PRODIGY_SD_05)** | Data Engineering | Python, BeautifulSoup4, Requests | Multi-threaded web scraping pipeline and CSV export pipeline developed during internship at Prodigy InfoTech. |
| **[Discover Prayagraj](https://github.com/morax-devs/Hometown-s-Homepage)** | AI Travel Concierge | React, JavaScript, AI Agent, CSS | Hometown web platform featuring automated AI itinerary curation, local heritage circuits, and attraction guides. |

---

## ✦ Physics Engine Architecture

The interactive ID badge runs on a custom, lightweight 2D Verlet integration engine with zero external physics dependencies:

```
[Ceiling Anchor (y <= 0)]
         │
         │  (7-segment flexible cloth constraints)
         │
      ┌─────┐
      │     │  ◄── Drag & Throw interactions (impulse momentum)
      │ ID  │  ◄── Scroll velocity aerodynamic air resistance (tiltX pitch)
      │     │  ◄── Progressive cursor wake deadzone (zero jitter)
      └─────┘
```

* **Verlet Particle System:** Particles calculate velocity implicitly from position deltas $(x - x_{\text{prev}})$, ensuring numerical stability and natural momentum conservation.
* **Love-Strings Slack Constraints:** Relaxed distance constraints allow the lanyard to fold and bow realistically when lifted or during upward rebounds.
* **3D Perspective Roll/Pitch:** Translates 2D motion and air drag into subtle CSS 3D transforms (`rotateX`, `rotateY`, `rotateZ`) and dynamic specular sheen highlights.

---

## ✦ Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Typography:** Plus Jakarta Sans (Editorial) & JetBrains Mono (Technical)
- **Styling:** Custom CSS Design Tokens (Near-Black Obsidian `#090a0d`, Warm White `#f4f4f6`, Electric Blue `#2d70f6`)
- **Icons:** Custom high-fidelity inline SVGs & Lucide React

---

## ✦ Project Structure

```text
amrendra-portfolio/
├── src/
│   ├── assets/               # Screenshots, photography, and optimized assets
│   ├── components/
│   │   ├── About/            # 01 // About editorial narrative & metadata
│   │   ├── common/
│   │   │   └── CipherScramble.jsx # High-speed terminal decryption component
│   │   ├── Contact/          # 05 // Contact statement & direct channels
│   │   ├── Experience/       # 04 // Experience & laser-drawn timeline
│   │   ├── Footer/           # Minimal footer & links
│   │   ├── HangingIdCard/    # 2D Verlet physics simulation & badge assembly
│   │   │   ├── HangingIdCard.jsx
│   │   │   ├── hangingIdCard.css
│   │   │   └── physics.js    # Custom Verlet engine & constraint solver
│   │   ├── Hero/             # Editorial introduction & actions
│   │   ├── Navbar/           # Sticky glassmorphic navbar & scroll progress
│   │   ├── Projects/         # 02 // Alternating project cards & browser frames
│   │   └── Toolkit/          # 03 // Disciplined 4-column typographic grid
│   ├── hooks/
│   │   └── useScrollReveal.js# Viewport intersection observer hook
│   ├── styles/
│   │   └── globals.css       # Design tokens, reset, and scroll animations
│   ├── App.jsx               # Root application layout
│   └── main.jsx              # DOM entry point
├── index.html                # HTML5 shell & font preloading
├── package.json
├── vite.config.js
└── README.md
```

---

## ✦ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/morax-devs/amrendra-portfolio.git
   cd amrendra-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Production assets will be output to the `dist/` directory.

---

## ✦ Contact & Profiles

- **Developer:** Amrendra Singh
- **Degree:** 3rd-Year B.Tech Computer Science & Engineering
- **GitHub:** [@morax-devs](https://github.com/morax-devs)
- **LinkedIn:** [Amrendra Singh](https://www.linkedin.com/in/amrendra-singh-62a334417/)
- **Email:** [amaranin63358@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=amaranin63358@gmail.com)

---

## ✦ License

This project is open-source and available under the [MIT License](LICENSE).

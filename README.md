# VEYG‑2k25

A modern, responsive event website for **VEYG 2K25** — showcasing schedules, technical games, guidelines, sponsors, and registrations with smooth animations and a delightful UX.

<p align="center">
  <img alt="VEYG 2k25 banner" src="https://img.shields.io/badge/VEYG-2K25-blue" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-Enabled-black?logo=framer" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

## ✨ Highlights

* 🎯 **Clean, festival‑style landing** with hero animations (typewriter title & subtle motion effects)
* 🧭 **Page sections**: Home, About, Guidelines, Technical Games, Schedule, Sponsors, Contact
* 🧩 **Components**: `PageHeroSection`, Sponsor slider, Technical game cards, Registration timer
* 🧠 **Hooks/Context**: `useDayWiseRegistration` (day‑wise logic), `AuthContext` (optional auth)
* 🧱 **UI**: React + React‑Bootstrap, Lucide icons, Framer Motion transitions
* 📱 **Responsive** out of the box, mobile‑first layout
* 🗺️ **Routing** with `react-router-dom`
* 🗃️ **Data‑driven** sections (e.g., `data/gamesData`)

> If your local setup differs (e.g., CRA vs Vite, Firebase, etc.), see the notes below. The README is structured so you can tweak the relevant parts quickly.

---

## 🗂️ Project Structure (suggested)

```
VEYG-2k25/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ HeroSection/
│  │  │  └─ HeroSection.jsx
│  │  ├─ SponsorSlider/
│  │  │  └─ SponsorSlider.jsx
│  │  ├─ TechnicalGames/
│  │  │  ├─ TechnicalGamesSection.jsx
│  │  │  └─ TechnicalGameCard.jsx
│  │  ├─ HeroSection/PageHeroSection.jsx
│  │  └─ RegistrationTimer.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ About.jsx
│  │  ├─ Guidelines.jsx
│  │  ├─ Schedule.jsx
│  │  ├─ TechnicalGames.jsx
│  │  ├─ Sponsors.jsx
│  │  └─ Contact.jsx
│  ├─ data/
│  │  └─ gamesData.js
│  ├─ hooks/
│  │  └─ useDayWiseRegistration.js
│  ├─ context/
│  │  └─ AuthContext.jsx
│  ├─ router/
│  │  └─ AppRouter.jsx
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ package.json
└─ README.md
```

> Your repository may organize files slightly differently; keep this as a reference and adjust names/paths accordingly.

---

## 🚀 Quick Start

> **Prerequisites**: Node.js ≥ 18, npm ≥ 9 (or yarn/pnpm)

```bash
# 1) Install dependencies
npm install

# 2) Run in development
npm run dev         # (Vite)
# or
npm start           # (Create React App)

# 3) Build for production
npm run build

# 4) Preview build (Vite only)
npm run preview
```

Open the app at the URL shown in your terminal (commonly `http://localhost:5173` for Vite or `http://localhost:3000` for CRA).

--

## 🧩 Key Features & Components

### Hero Section

* Typewriter animation for **VEYG 2K25** title
* Background canvas/particles/“neural” effect (optional)
* Subtle entrance transitions with Framer Motion

### Technical Games

* Data‑driven cards with title, description, day, tags
* Filters/search (optional) and dynamic day‑wise registration logic via `useDayWiseRegistration`

### Guidelines & Schedule

* Clean, card‑based layout using `react-bootstrap`
* Icons via `lucide-react`
* Motion transitions on section load and scroll

### Sponsors

* Auto‑scrolling/carousel **Sponsor Slider**
* Logos with accessible alt text and external links

### Registration

* `RegistrationTimer` to show deadlines/opens/ends
* Optional auth flow via `AuthContext`

---

## 🛠️ Tech Stack

* **Frontend**: React 18, React Router
* **UI**: React‑Bootstrap (Bootstrap 5), Lucide Icons
* **Animations**: Framer Motion
* **State/Logic**: React Context & custom hooks
* **Tooling**: Vite or CRA (depending on your setup)

> You can freely swap in Tailwind or CSS Modules if desired; the component structure is framework‑agnostic.

---

## 📦 Scripts (examples)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "react-scripts start",
    "test": "react-scripts test",
    "build:cra": "react-scripts build"
  }
}
```

> Use the ones that apply to your setup. If you’re using Vite, `dev/build/preview` are typical. If you’re on CRA, use `start/build/test`.

---

## 🧪 Testing (optional)

If you add tests with Vitest/Jest + React Testing Library:

```bash
npm run test
```

Create tests under `src/__tests__/` or alongside components.

---

## 🧹 Linting & Formatting (optional but recommended)

* **ESLint** for code quality
* **Prettier** for consistent formatting

Example commands:

```bash
npm run lint
npm run format
```

---

## 🚢 Deployment

**Vercel** (recommended for React SPAs)

1. Push your repo to GitHub
2. Import the repo in Vercel, set environment variables (if any)
3. Framework preset: *Vite* or *Create React App*

**Netlify**

1. New site from Git
2. Build command: `vite build` (Vite) or `npm run build` (CRA)
3. Publish directory: `dist` (Vite) or `build` (CRA)

**GitHub Pages**

* Use `vite-plugin-gh-pages` or CRA’s `gh-pages` package
  
---

## 🙌 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-thing`
3. Commit changes: `git commit -m "feat: add amazing thing"`
4. Push: `git push origin feat/amazing-thing`
5. Open a Pull Request

**Code style**: Keep components small, accessible, and well‑documented. Prefer composable props and data‑driven UIs.

---

## 🐞 Troubleshooting

* Blank page after build? Ensure correct **base** path (Vite) or homepage (CRA)
* CSS not loading? Verify Bootstrap import and bundler config
* Animations janky? Wrap sections with `motion.div` and use reduced‑motion preferences
* Router issues on refresh? Configure SPA fallback on your host (e.g., Netlify/Vercel)

---

## 📄 License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## 👤 Maintainer

**Fenil Khatri**
GitHub: [@FenilKhatri](https://github.com/FenilKhatri)

---

## 🗒️ Notes for Future Contributors

* Replace placeholder images and texts with official VEYG 2K25 content
* Keep `gamesData.js` tidy & typed (consider JSDoc or TS)
* Add analytics (e.g., Plausible) if needed
* Consider adding i18n and dark mode toggle

---

> **Tip:** If your project uses other services (e.g., Firebase Auth/Firestore, EmailJS, etc.), add those steps under **Environment Variables** and **Deployment**. This README is designed to be easily customized — edit any section to match the exact stack in this repo.

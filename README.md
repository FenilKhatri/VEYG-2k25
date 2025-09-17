# VEYG‑2k25

A full-stack event management platform for **VEYG 2K25** — featuring game registrations, admin dashboard, real-time notifications, and secure authentication with MongoDB backend and React frontend.

<p align="center">
  <img alt="VEYG 2k25 banner" src="https://img.shields.io/badge/VEYG-2K25-blue" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-Enabled-black?logo=framer" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

## ✨ Features

* 🎯 **Full-Stack Architecture**: Node.js/Express backend with React frontend
* 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
* 📊 **Admin Dashboard**: Real-time registration management and statistics
* 🎮 **Game Registration**: Day-wise registration system with validation
* 📧 **Email Notifications**: Automated welcome emails with login credentials
* 🔄 **Real-time Updates**: WebSocket integration for live notifications
* 💾 **MongoDB Integration**: Secure data persistence with Mongoose ODM
* 📱 **Responsive Design**: Mobile-first UI with React-Bootstrap
* 🎨 **Modern UI/UX**: Framer Motion animations and clean design
* 🚀 **Production Ready**: Deployed on Render with environment configuration

> **Security Note**: All sensitive credentials are stored in environment variables and excluded from version control.

---

## 🗂️ Project Structure

```
VEYG-2k25/
├─ Backend/
│  ├─ controllers/
│  │  ├─ adminController.js
│  │  ├─ studentController.js
│  │  ├─ gameRegistrationController.js
│  │  └─ contactController.js
│  ├─ middleware/
│  │  ├─ auth.js
│  │  └─ validation.js
│  ├─ models/
│  │  ├─ Admin.js
│  │  ├─ Student.js
│  │  ├─ GameRegistration.js
│  │  └─ Contact.js
│  ├─ router/
│  │  ├─ adminRoutes.js
│  │  ├─ studentRoutes.js
│  │  └─ gameRegistrationRoutes.js
│  ├─ services/
│  │  ├─ websocket.js
│  │  └─ emailService.js
│  ├─ utils/
│  │  ├─ auth.js
│  │  ├─ db.js
│  │  └─ dayWiseValidation.js
│  ├─ .env.example
│  ├─ .gitignore
│  ├─ server.js
│  └─ package.json
├─ Frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ auth/
│  │  │  ├─ Games/
│  │  │  └─ SponsorSlider/
│  │  ├─ pages/
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ GamePage.jsx
│  │  │  └─ Profile.jsx
│  │  ├─ services/
│  │  │  ├─ api.js
│  │  │  └─ websocket.js
│  │  ├─ utils/
│  │  │  └─ registrationUtils.js
│  │  ├─ context/
│  │  │  └─ AuthContext.jsx
│  │  └─ App.jsx
│  ├─ .env.example
│  └─ package.json
├─ .gitignore
└─ README.md
```

---

## 🚀 Quick Start

> **Prerequisites**: Node.js ≥ 18, npm ≥ 9, MongoDB Atlas account

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-username/VEYG-2k25.git
cd VEYG-2k25

# Backend setup
cd Backend
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)
npm install

# Frontend setup
cd ../Frontend
npm install
```

### 2. Environment Variables

Create `Backend/.env` file with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/VEYG-2k25
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=3002
NODE_ENV=development
ORGANIZATION_NAME=VEYG 2025
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

- Backend: `http://localhost:3002`
- Frontend: `http://localhost:5173`

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

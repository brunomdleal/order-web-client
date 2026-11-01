# Order Web Client

A modern Single Page Application (SPA) dashboard built with React, TypeScript, and Vite to manage and track orders across the microservice ecosystem.

---

## Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 | UI component tree and state management |
| **Language** | TypeScript | Strict compile-time safety across UI models |
| **Build Tool** | Vite | Fast ESM development server and Rollup bundler |
| **Linter** | ESLint | Code quality, formatting, and React hooks rules |
| **Runtime Target** | Docker + Nginx | Multi-stage unprivileged static asset container |

---

## Getting Started

### Prerequisites
* Node.js 20+
* npm

### Running Locally
```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the application in the browser.

### Production Build

```bash
# Compile and bundle static assets into dist/
npm run build

# Preview production build locally
npm run preview
```

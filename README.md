# Order Web Client (SPA)

A modern, cloud-native Single Page Application (SPA) dashboard engineered with **React 19**, **TypeScript**, and **Vite** for order ingestion, lifecycle tracking, and microservice telemetry. 

The application is packaged into a hardened, unprivileged multi-stage Alpine Nginx container designed to run seamlessly behind edge Ingress gateways and local Docker Compose environments with zero cluster DNS dependencies.

---

## Architecture & Edge Ingress Integration

The web client serves compiled static frontend assets (`index.html`, JavaScript bundles, CSS, assets) while completely delegating backend API proxying to the cluster's ingress controller:

```
                          [Edge / Client Browser]
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │        Cluster Ingress Controller       │
                │        (dev.order.local / Port 80)      │
                └───────────┬─────────────────┬───────────┘
                            │                 │
                Path: `/`   │                 │   Path: `/api`
                            ▼                 ▼
             ┌─────────────────────┐   ┌─────────────────────┐
             │  order-web-client   │   │    order-service    │
             │   (Port 8080 TCP)   │   │   (Port 8080 TCP)   │
             │  • Nginx unprivileged│  │  • Spring Boot 4    │
             │  • React SPA dist/  │   │  • PostgreSQL DB    │
             └─────────────────────┘   └─────────────────────┘
```

* **No Internal Upstream Lookups:** Nginx strictly serves static files and handles SPA client-side routing fallbacks (`try_files $uri $uri/ /index.html;`), eliminating fragile `host.docker.internal` lookups inside Kubernetes.
* **Edge Routing Decoupling:** Ingress controllers or API gateways handle upstream routing to `/api/v1/orders` without requiring Nginx proxy passes inside the frontend container.

---

## Tech Stack & Tooling

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **UI Framework** | React | 19.x | Component lifecycle, responsive UI, declarative state |
| **Language** | TypeScript | 5.x | Strict type safety across UI models and backend contracts |
| **Build Toolchain** | Vite | 6.x | Fast ESM local development server and optimized Rollup production bundler |
| **Static Web Server** | Nginx Alpine | 1.27+ | Minimalist, unprivileged production static server |
| **Container Engine** | Docker | Multi-stage | Build isolation, non-root user execution, vulnerability hardening |
| **CI/CD** | GitHub Actions | Workflows | Automated linting, test execution, Trivy CVE scans, and GHCR publishing |

---

## Security & Container Hardening Posture

* **Unprivileged Non-Root Execution:** Nginx runs strictly under the unprivileged `nginx` system user (`UID 101` / `GID 101`) listening on non-privileged port `8080`.
* **Read-Only Root Filesystem Ready:** The runtime container mounts ephemeral writable locations (`/tmp`, `/var/cache/nginx`, `/var/run`) over in-memory `emptyDir` volumes, allowing execution with `readOnlyRootFilesystem: true`.
* **Defensive HTTP Response Headers:** Every HTTP response sent by Nginx injects protective security headers:
  * `X-Frame-Options: SAMEORIGIN` (prevents clickjacking attacks)
  * `X-Content-Type-Options: nosniff` (mitigates MIME-confusion attacks)
  * `X-XSS-Protection: 1; mode=block` (enforces browser XSS filters)
* **High-Performance Static Delivery:** Gzip compression enabled for files `> 1024 bytes` with aggressive 1-year immutable caching (`Cache-Control: "public, immutable"`) for hashed JS/CSS assets.

---

## Local Development & Fast Feedback

### Prerequisites
* **Node.js:** `v20.x` LTS or `v22.x`
* **Package Manager:** `npm` (bundled with Node)

### Running Locally with Dev Server
```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server with Hot Module Replacement (HMR)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Local Production Build & Preview
```bash
# Compile and bundle static assets into dist/
npm run build

# Preview production build locally via Vite preview server
npm run preview
```

---

## Container Build & Verification

### 1. Build the Multi-Stage Image
```bash
docker build -t ghcr.io/brunomdleal/order-web-client:latest .
```

### 2. Run Container Locally
```bash
docker run --rm -d --name order-web -p 8080:8080 ghcr.io/brunomdleal/order-web-client:latest
```

### 3. Verify Health & Response
```bash
curl -I http://localhost:8080
```
*Expected Output:* `HTTP/1.1 200 OK` with `server: nginx` and the configured security headers.

To stop the test container:
```bash
docker stop order-web
```

---

## Kubernetes & Platform Orchestration

Deployment manifests and environment overlays for this service are managed in the centralized platform repository:
* **Base Workload Manifests:** [`platform-delivery-engine/k8s/base/order-web-client-deployment.yaml`](https://github.com/brunomdleal/platform-delivery-engine)
* **Cluster Service (Port 80 -> 8080):** [`platform-delivery-engine/k8s/base/order-web-client-service.yaml`](https://github.com/brunomdleal/platform-delivery-engine)
* **Ingress Rule Definition:** [`platform-delivery-engine/k8s/base/ingress.yaml`](https://github.com/brunomdleal/platform-delivery-engine)

---

## Repository Structure

```text
order-web-client/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated build, lint, Trivy CVE scan & GHCR push
├── public/
│   └── vite.svg                 # Static branding assets
├── src/
│   ├── assets/                  # Application SVGs and stylesheets
│   ├── components/              # Modular React UI components (OrderForm, OrderTable)
│   ├── types/                   # TypeScript contract interfaces matching API DTOs
│   ├── App.css                  # Core component styles
│   ├── App.tsx                  # Root dashboard view
│   ├── index.css                # Global styles and resets
│   └── main.tsx                 # React DOM mount point
├── default.conf                 # Hardened Nginx configuration (Port 8080, SPA try_files)
├── Dockerfile                   # Multi-stage production build (Node 22 -> Nginx Alpine)
├── .dockerignore                # Build context exclusion rules
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies, scripts, and engine locks
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration and proxy rules
└── README.md
```

---

## Author

**Bruno Leal**  
*Platform & DevOps Tooling Engineer*  
[LinkedIn](https://linkedin.com/in/bruno-m-d-leal) • [GitHub](https://github.com/brunomdleal)
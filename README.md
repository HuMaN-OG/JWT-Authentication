# 🔐 JWT Authentication — React Demo

> A polished, interactive **JWT authentication demo** built with **React 19 + Vite**. Demonstrates how JSON Web Tokens work end-to-end — login, token generation, protected routes, token inspection, and role-based access — all running entirely in the browser.

![JWT Auth Demo](./src/assets/hero.png)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Login Page** | Animated glassmorphism card with demo quick-fill buttons |
| **JWT Simulation** | `Header.Payload.Signature` structure with Base64url encoding |
| **Protected Route** | Dashboard only renders when a valid, unexpired token exists |
| **Token Inspector** | Color-coded raw token + decoded header / payload / signature |
| **Role-Based Access** | Three roles (`admin`, `editor`, `viewer`) with distinct permissions |
| **Session Persistence** | Token stored in `localStorage`; survives page refresh |
| **Auto Expiry** | Tokens expire after 1 hour; invalid/expired tokens auto-clear |
| **Responsive Design** | Fully responsive dark UI with micro-animations |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/jwt-authentication.git
cd jwt-authentication

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧑‍💻 Demo Credentials

The app ships with three pre-built accounts. Use the quick-fill pills on the login screen or enter manually:

| Role | Username | Password | Permissions |
|---|---|---|---|
| 👑 Admin | `admin` | `admin123` | Read, Write, Delete, Manage Users, System Settings |
| ✏️ Editor | `editor` | `editor123` | Read, Write, Publish Content |
| 👁️ Viewer | `viewer` | `viewer123` | Read |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx          # Login form with demo quick-fill
│   ├── LoginPage.module.css
│   ├── Dashboard.jsx          # Protected dashboard + token inspector
│   └── Dashboard.module.css
├── context/
│   └── AuthContext.jsx        # Global auth state (login / logout / rehydrate)
├── utils/
│   ├── jwt.js                 # Token generation, decoding, storage helpers
│   └── users.js               # Simulated user DB & role metadata
├── App.jsx                    # Root – AuthProvider + protected route logic
├── main.jsx
└── index.css                  # Global reset & design tokens
```

---

## 🔑 How JWT Works in This Demo

```
1. Login       → Credentials validated against the in-memory user store
2. Generate    → JWT created: Base64url(Header) . Base64url(Payload) . Signature
3. Store       → Token saved to localStorage with a 1-hour expiry (exp claim)
4. Route Guard → Dashboard renders only when token is present, valid & unexpired
5. Inspect     → Token Inspector panel shows color-coded raw token + decoded JSON
6. Logout      → Token removed from storage; user redirected to login
```

> **⚠️ Educational Notice**
> This project simulates JWT signing on the **client side** for learning purposes.
> In a real application, tokens must be signed server-side with a secret that never leaves the backend.
> Passwords should be hashed (e.g., bcrypt) and **never** stored in plain text.

---

## 🛠️ Tech Stack

- **React 19** — UI library
- **Vite 8** — build tool & dev server
- **CSS Modules** — scoped component styles
- **Oxlint** — fast JavaScript linter

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimised production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint static analysis |

---

## 📄 License

[MIT](./LICENSE)

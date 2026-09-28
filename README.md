# JWT Authentication Demo

A hands-on demo I built to properly understand how JWT (JSON Web Token) authentication works under the hood — token structure, signing, expiry, and protected routes — all without any backend.

**Live demo → [humaN-OG.github.io/JWT-Authentication](https://human-og.github.io/JWT-Authentication/)**

![screenshot](./src/assets/hero.png)

---

## Why I built this

Most JWT tutorials either skip the internals entirely or require a full backend setup before you can see anything happen. I wanted something I could run instantly in the browser and actually *see* the token being constructed, encoded, and decoded in real time.

So I built a self-contained demo that:
- Generates a real `Header.Payload.Signature` JWT structure
- Lets you inspect every part of the token after login
- Shows how a protected route behaves when the token is valid, expired, or missing
- Demonstrates role-based permissions (admin / editor / viewer)

---

## Features

- **Login page** with animated glassmorphism UI and one-click demo account fill
- **JWT token generation** using Base64url encoding (mirrors the real spec)
- **Token Inspector** — click to expand and see the raw + decoded token with color-coded parts
- **Protected route** — dashboard only renders when a valid, unexpired token is in storage
- **3 user roles** with different permission sets
- **Session persistence** — token survives page refresh (stored in `localStorage`)
- **Auto expiry** — tokens expire after 1 hour and auto-clear on next load
- **Fully responsive** dark UI

---

## Demo accounts

| Role | Username | Password |
|---|---|---|
| 👑 Admin | `admin` | `admin123` |
| ✏️ Editor | `editor` | `editor123` |
| 👁️ Viewer | `viewer` | `viewer123` |

Use the quick-fill buttons on the login screen — no need to type.

---

## Running locally

```bash
git clone https://github.com/HuMaN-OG/JWT-Authentication.git
cd JWT-Authentication
npm install
npm run dev
```

Runs at `http://localhost:5173`

---

## Project structure

```
src/
├── components/
│   ├── LoginPage.jsx       # login form + demo quick-fill
│   └── Dashboard.jsx       # protected dashboard + token inspector
├── context/
│   └── AuthContext.jsx     # login / logout / session rehydration
├── utils/
│   ├── jwt.js              # token generation, decoding, localStorage helpers
│   └── users.js            # mock user DB + role metadata
└── App.jsx                 # protected route logic
```

---

## How the JWT flow works

```
Login       →  credentials checked against mock user store
Generate    →  JWT built: base64url(header) + "." + base64url(payload) + "." + signature
Store       →  token saved to localStorage with 1hr expiry (exp claim)
Route guard →  dashboard renders only if token is present, valid, and not expired
Logout      →  token removed, user sent back to login
```

> **Note:** Token signing happens client-side here for demo purposes only.
> In a real app, signing must happen server-side with a secret the client never sees.
> Passwords here are plain text — use bcrypt in production.

---

## Tech

- React 19
- Vite 8
- CSS Modules
- No external auth libraries — everything is hand-rolled for learning

---

## License

MIT

// ─── Simulated User Database ──────────────────────────────────────────────────
// In a real app this would live on a secure backend.
// Passwords would be bcrypt hashed, never stored in plain text.

export const USERS = [
  {
    id: "usr_001",
    username: "admin",
    password: "admin123",   // educational only — hash in production!
    role: "admin",
    displayName: "Alice Admin",
    avatar: "AA",
    department: "Engineering",
    email: "alice@example.com",
  },
  {
    id: "usr_002",
    username: "editor",
    password: "editor123",
    role: "editor",
    displayName: "Bob Editor",
    avatar: "BE",
    department: "Content",
    email: "bob@example.com",
  },
  {
    id: "usr_003",
    username: "viewer",
    password: "viewer123",
    role: "viewer",
    displayName: "Carol Viewer",
    avatar: "CV",
    department: "Marketing",
    email: "carol@example.com",
  },
];

/** Attempt login — returns user object without password or null on failure */
export function authenticate(username, password) {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;
  const { password: _omit, ...safeUser } = user;
  return safeUser;
}

/** Role → display metadata */
export const ROLE_META = {
  admin: {
    label: "Administrator",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.15)",
    icon: "👑",
    permissions: ["Read", "Write", "Delete", "Manage Users", "System Settings"],
  },
  editor: {
    label: "Editor",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.15)",
    icon: "✏️",
    permissions: ["Read", "Write", "Publish Content"],
  },
  viewer: {
    label: "Viewer",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.15)",
    icon: "👁️",
    permissions: ["Read"],
  },
};

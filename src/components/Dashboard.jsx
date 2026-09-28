import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "../utils/jwt";
import { ROLE_META } from "../utils/users";
import styles from "./Dashboard.module.css";

// ── Small sub-components ──────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={styles.statCard} style={{ "--accent": accent }}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function PermissionBadge({ label }) {
  return <span className={styles.permBadge}>{label}</span>;
}

// ── Token Inspector panel ─────────────────────────────────────────────────────

function TokenInspector({ token }) {
  const [open, setOpen] = useState(false);
  const decoded = decodeToken(token);

  if (!decoded) return null;

  const headerB64  = token.split(".")[0];
  const payloadB64 = token.split(".")[1];
  const sigB64     = token.split(".")[2];

  return (
    <div className={styles.inspector}>
      <button
        className={styles.inspectorToggle}
        onClick={() => setOpen((v) => !v)}
        id="token-inspector-toggle"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {open ? "Hide Token Inspector" : "Inspect JWT Token"}
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>▾</span>
      </button>

      {open && (
        <div className={styles.inspectorBody}>
          {/* Raw token with color-coded parts */}
          <div className={styles.tokenRaw}>
            <span className={styles.tokenHeader}>{headerB64}</span>
            <span className={styles.tokenDot}>.</span>
            <span className={styles.tokenPayload}>{payloadB64}</span>
            <span className={styles.tokenDot}>.</span>
            <span className={styles.tokenSig}>{sigB64}</span>
          </div>

          <div className={styles.tokenLegend}>
            <span className={styles.legendHeader}>■ Header</span>
            <span className={styles.legendPayload}>■ Payload</span>
            <span className={styles.legendSig}>■ Signature</span>
          </div>

          {/* Decoded sections */}
          <div className={styles.decodedSections}>
            <div className={styles.decodedBlock}>
              <p className={styles.decodedTitle} style={{ color: "#fb923c" }}>HEADER</p>
              <pre className={styles.pre}>{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div className={styles.decodedBlock}>
              <p className={styles.decodedTitle} style={{ color: "#34d399" }}>PAYLOAD</p>
              <pre className={styles.pre}>{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
            <div className={styles.decodedBlock}>
              <p className={styles.decodedTitle} style={{ color: "#f472b6" }}>SIGNATURE</p>
              <pre className={styles.pre}>{sigB64}</pre>
              <p className={styles.sigNote}>
                {decoded.valid ? "✅ Signature verified" : "❌ Invalid signature"}
              </p>
            </div>
          </div>

          <div className={styles.tokenMeta}>
            <div className={styles.tokenMetaItem}>
              <span className={styles.metaKey}>Issued At</span>
              <span className={styles.metaVal}>
                {new Date(decoded.payload.iat * 1000).toLocaleString()}
              </span>
            </div>
            <div className={styles.tokenMetaItem}>
              <span className={styles.metaKey}>Expires At</span>
              <span className={styles.metaVal}>
                {new Date(decoded.payload.exp * 1000).toLocaleString()}
              </span>
            </div>
            <div className={styles.tokenMetaItem}>
              <span className={styles.metaKey}>Token ID (jti)</span>
              <span className={styles.metaVal} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>
                {decoded.payload.jti}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const roleMeta = ROLE_META[user.role] ?? ROLE_META.viewer;

  const expDate  = new Date((decodeToken(token)?.payload?.exp ?? 0) * 1000);
  // useMemo avoids calling Date.now() directly during render (oxlint purity)
  const timeLeft = useMemo(
    () => Math.max(0, Math.floor((expDate.getTime() - Date.now()) / 60000)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  return (
    <div className={styles.page}>
      {/* Subtle background grid */}
      <div className={styles.grid} />

      {/* Top Nav */}
      <header className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>🔐</span>
          <span className={styles.navTitle}>JWT Auth</span>
          <span className={styles.navTag}>Dashboard</span>
        </div>
        <div className={styles.navRight}>
          <div className={styles.sessionPill}>
            <span className={styles.sessionDot} />
            Session expires in {timeLeft}m
          </div>
          <button id="logout-btn" className={styles.logoutBtn} onClick={logout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Welcome Hero */}
        <section className={styles.hero}>
          <div className={styles.avatarRing} style={{ "--role-color": roleMeta.color }}>
            <div className={styles.avatar}>{user.avatar}</div>
          </div>
          <div className={styles.heroText}>
            <p className={styles.heroGreet}>Welcome back,</p>
            <h1 className={styles.heroName}>{user.displayName}</h1>
            <div className={styles.roleBadge} style={{ color: roleMeta.color, background: roleMeta.bg }}>
              {roleMeta.icon} {roleMeta.label}
            </div>
          </div>
        </section>

        {/* Stat Cards */}
        <section className={styles.stats}>
          <StatCard icon="🪪" label="User ID"     value={user.userId}     accent="#6366f1" />
          <StatCard icon="📧" label="Email"        value={user.email}      accent="#8b5cf6" />
          <StatCard icon="🏢" label="Department"   value={user.department} accent="#06b6d4" />
          <StatCard icon="🔑" label="Role"         value={roleMeta.label}  accent={roleMeta.color} />
        </section>

        {/* Permissions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Your Permissions
          </h2>
          <div className={styles.permGrid}>
            {roleMeta.permissions.map((p) => (
              <PermissionBadge key={p} label={p} />
            ))}
          </div>
        </section>

        {/* Token Inspector */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            JWT Token
          </h2>
          <TokenInspector token={token} />
        </section>

        {/* Auth Flow Explainer */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            How It Works
          </h2>
          <div className={styles.flowSteps}>
            {[
              { n: "1", title: "Login",          desc: "Credentials validated against the user store.",                      icon: "🧑‍💻" },
              { n: "2", title: "Token Generated", desc: "JWT created with Header · Payload · Signature.",                    icon: "⚙️" },
              { n: "3", title: "Token Stored",    desc: "Token persisted in localStorage for session continuity.",            icon: "💾" },
              { n: "4", title: "Protected Route", desc: "Dashboard only rendered when a valid, unexpired token is present.",  icon: "🛡️" },
              { n: "5", title: "Logout",          desc: "Token removed from storage, user redirected to login.",              icon: "🚪" },
            ].map((step) => (
              <div key={step.n} className={styles.flowStep}>
                <div className={styles.flowNum}>{step.n}</div>
                <div className={styles.flowContent}>
                  <p className={styles.flowTitle}>{step.icon} {step.title}</p>
                  <p className={styles.flowDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

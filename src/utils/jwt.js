// ─── Simulated JWT Utility ───────────────────────────────────────────────────
// Implements a lightweight JWT-like token structure:
//   Header.Payload.Signature  (base64url encoded)
// This is for EDUCATIONAL purposes — do NOT use client-side JWT signing in production.

const SECRET = "jwt-auth-demo-secret-key"; // In reality this lives server-side only

/** Base64url encode (no padding) */
function base64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Base64url decode */
function base64urlDecode(str) {
  // Re-add padding
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return null;
  }
}

/** Simple HMAC-like signature using XOR + charCode sum (educational only) */
function createSignature(headerPayload, secret) {
  let hash = 0;
  const combined = headerPayload + secret;
  for (let i = 0; i < combined.length; i++) {
    const chr = combined.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // 32-bit int
  }
  return base64urlEncode(Math.abs(hash).toString(36));
}

// ─── Token Generation ─────────────────────────────────────────────────────────

/**
 * Generates a simulated JWT token.
 * @param {{ userId: string, username: string, role: string }} payload
 * @param {number} expiresInSeconds  default 3600 (1 hour)
 */
export function generateToken(payload, expiresInSeconds = 3600) {
  const header = { alg: "HS256-sim", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload = {
    ...payload,
    iat: now,                       // issued at
    exp: now + expiresInSeconds,    // expiry
    jti: crypto.randomUUID(),       // JWT ID
  };

  const encodedHeader  = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));
  const headerPayload  = `${encodedHeader}.${encodedPayload}`;
  const signature      = createSignature(headerPayload, SECRET);

  return `${headerPayload}.${signature}`;
}

// ─── Token Decoding ───────────────────────────────────────────────────────────

/**
 * Decodes a token. Returns { header, payload, valid, expired } or null on error.
 */
export function decodeToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const header  = JSON.parse(base64urlDecode(parts[0]));
    const payload = JSON.parse(base64urlDecode(parts[1]));

    const headerPayload = `${parts[0]}.${parts[1]}`;
    const expectedSig   = createSignature(headerPayload, SECRET);
    const valid         = expectedSig === parts[2];

    const now     = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;

    return { header, payload, valid, expired };
  } catch {
    return null;
  }
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = "jwt_auth_token";

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Returns the decoded payload from storage if the token is valid & not expired.
 * Otherwise clears it and returns null.
 */
export function getAuthPayload() {
  const token = getStoredToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.valid || decoded.expired) {
    removeToken();
    return null;
  }
  return decoded.payload;
}

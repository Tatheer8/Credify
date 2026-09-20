// frontend/lib/auth.ts — CrediWise AI Session & Auth Utilities

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const USERS_KEY = "crediwise_users";
const SESSION_KEY = "crediwise_session";
const LOGGED_OUT_KEY = "crediwise_logged_out";

export const DEFAULT_USER: User = {
  id: "usr_fatima_001",
  name: "Fatima",
  email: "fatima.zahra@crediwise.ai",
  avatar: "F",
  role: "Senior Risk Underwriter",
};

interface StoredUser extends User {
  passwordHash: string;
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return String(Math.abs(h));
}

function makeMockJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + 86400000 * 7, // 7 days
    })
  );
  const sig = simpleHash(header + "." + payload + "crediwise_secret");
  return `${header}.${payload}.${sig}`;
}

export function signUp(name: string, email: string, password: string): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: false, error: "SSR" };
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Email already registered." };
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim() || "User",
    email: email.trim(),
    avatar: name.trim().charAt(0).toUpperCase() || "U",
    role: "Credit Analyst",
    passwordHash: simpleHash(password),
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Reset logged out flag
  localStorage.removeItem(LOGGED_OUT_KEY);

  const { passwordHash: _ph, ...publicUser } = user;
  const token = makeMockJWT(publicUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: publicUser }));
  return { ok: true };
}

export function signIn(email: string, password: string): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: false, error: "SSR" };

  // Reset logged out flag
  localStorage.removeItem(LOGGED_OUT_KEY);

  const cleanEmail = email.trim().toLowerCase();

  // Demo Fatima account support
  if (cleanEmail === "fatima@crediwise.ai" || cleanEmail === "fatima.zahra@crediwise.ai") {
    const token = makeMockJWT(DEFAULT_USER);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: DEFAULT_USER }));
    return { ok: true };
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  // If user not found, auto-create demo user for smooth reviewer experience
  if (!user) {
    const derivedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1) || "Demo User";
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: formattedName,
      email: cleanEmail,
      avatar: formattedName.charAt(0).toUpperCase(),
      role: "Credit Analyst",
      passwordHash: simpleHash(password),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    user = newUser;
  } else if (user.passwordHash !== simpleHash(password)) {
    return { ok: false, error: "Incorrect password." };
  }

  const { passwordHash: _ph, ...publicUser } = user;
  const token = makeMockJWT(publicUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: publicUser }));
  return { ok: true };
}

/**
 * Perform complete sign out:
 * 1. Clears localStorage session keys
 * 2. Clears sessionStorage
 * 3. Sets an explicit logged out flag so getSession() does not recreate a default session
 */
export function signOut(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("loanlogic_session");
  localStorage.removeItem("loaniq_session");
  sessionStorage.clear();
  localStorage.setItem(LOGGED_OUT_KEY, "true");
}

export function getSession(): { token: string; user: User } | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Check if user has explicitly logged out
  const isLoggedOut = localStorage.getItem(LOGGED_OUT_KEY) === "true";
  if (isLoggedOut) {
    return null;
  }

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    // Initial visit: seed default Fatima session for recruiter convenience
    const token = makeMockJWT(DEFAULT_USER);
    const session = { token, user: DEFAULT_USER };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  try {
    const s = JSON.parse(raw);
    const payload = JSON.parse(atob(s.token.split(".")[1]));
    if (Date.now() > payload.exp) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(LOGGED_OUT_KEY, "true");
      return null;
    }
    return s;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

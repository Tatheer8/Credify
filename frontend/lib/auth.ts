// frontend/lib/auth.ts — CrediWise AI Session & Auth Utilities

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isGuest?: boolean;
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

  // Reset logged out flag and clean guest artifacts
  localStorage.removeItem(LOGGED_OUT_KEY);
  localStorage.removeItem("crediwise_guest_session");
  sessionStorage.removeItem("crediwise_guest_session");
  document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  const { passwordHash: _ph, ...publicUser } = user;
  const token = makeMockJWT(publicUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: publicUser }));

  // Notify components of auth change
  window.dispatchEvent(new Event("auth-change"));
  return { ok: true };
}

export function signIn(email: string, password: string): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: false, error: "SSR" };

  // Reset logged out flag and clean guest artifacts
  localStorage.removeItem(LOGGED_OUT_KEY);
  localStorage.removeItem("crediwise_guest_session");
  sessionStorage.removeItem("crediwise_guest_session");
  document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  const cleanEmail = email.trim().toLowerCase();

  // Demo Fatima and sandbox account support
  if (cleanEmail === "fatima@crediwise.ai" || cleanEmail === "fatima.zahra@crediwise.ai") {
    const token = makeMockJWT(DEFAULT_USER);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: DEFAULT_USER }));
    window.dispatchEvent(new Event("auth-change"));
    return { ok: true };
  }
  if (cleanEmail === "demo@crediwise.ai") {
    const demoUser: User = {
      id: "usr_demo_001",
      name: "Demo Underwriter",
      email: "demo@crediwise.ai",
      avatar: "D",
      role: "Credit Analyst",
    };
    const token = makeMockJWT(demoUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: demoUser }));
    window.dispatchEvent(new Event("auth-change"));
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
  window.dispatchEvent(new Event("auth-change"));
  return { ok: true };
}

/**
 * Initialize a temporary guest session:
 * 1. Clears any logout flag
 * 2. Generates a guest User and JWT session object
 * 3. Saves guest session in localStorage & sessionStorage
 * 4. Sets a client-side is_guest=true cookie for route guards & middleware
 * 5. Dispatches an auth-change event so UI updates immediately
 */
export function continueAsGuest(): { ok: boolean; user: User } {
  if (typeof window === "undefined") return { ok: false, user: DEFAULT_USER };

  localStorage.removeItem(LOGGED_OUT_KEY);

  const guestId = "guest_" + Date.now();
  const guestUser: User = {
    id: guestId,
    name: "Guest User",
    email: "guest@crediwise.ai",
    avatar: "G",
    role: "Guest Underwriter",
    isGuest: true,
  };

  const token = makeMockJWT(guestUser);
  const session = { token, user: guestUser };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Store guest state object in localStorage & sessionStorage matching specifications
  const guestState = { isGuest: true, role: "guest", name: "Guest User", id: guestId };
  localStorage.setItem("crediwise_guest_session", JSON.stringify(guestState));
  sessionStorage.setItem("crediwise_guest_session", JSON.stringify(guestState));

  // Set is_guest cookie for middleware / server route checks
  document.cookie = "is_guest=true; path=/; max-age=86400; SameSite=Lax";

  // Notify components of auth change
  window.dispatchEvent(new Event("auth-change"));

  return { ok: true, user: guestUser };
}

/**
 * Perform complete sign out:
 * 1. Clears localStorage session keys
 * 2. Clears sessionStorage and guest state
 * 3. Clears is_guest cookie
 * 4. Sets an explicit logged out flag so getSession() does not recreate a default session
 * 5. Emits auth-change event
 */
export function signOut(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("crediwise_guest_session");
  localStorage.removeItem("loanlogic_session");
  localStorage.removeItem("loaniq_session");
  sessionStorage.clear();
  document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.setItem(LOGGED_OUT_KEY, "true");
  window.dispatchEvent(new Event("auth-change"));
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
    // Initial visit: initialize seamless Guest Mode so visitors can explore immediately without friction
    continueAsGuest();
    const guestRaw = localStorage.getItem(SESSION_KEY);
    if (guestRaw) {
      try {
        return JSON.parse(guestRaw);
      } catch {
        return null;
      }
    }
    return null;
  }

  try {
    const s = JSON.parse(raw);
    const payload = JSON.parse(atob(s.token.split(".")[1]));
    if (Date.now() > payload.exp) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("crediwise_guest_session");
      localStorage.setItem(LOGGED_OUT_KEY, "true");
      document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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

export function isGuestUser(): boolean {
  if (typeof window === "undefined") return false;
  const session = getSession();
  if (session?.user?.isGuest) return true;

  const guestRaw =
    localStorage.getItem("crediwise_guest_session") ||
    sessionStorage.getItem("crediwise_guest_session");
  if (guestRaw) {
    try {
      const parsed = JSON.parse(guestRaw);
      if (parsed?.isGuest) return true;
    } catch {
      // ignore json parse error
    }
  }

  return document.cookie.includes("is_guest=true");
}

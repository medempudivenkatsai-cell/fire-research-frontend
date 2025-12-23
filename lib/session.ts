"use client";

import { useEffect, useState } from "react";

export type Role = "viewer" | "researcher" | "admin";

export type Session = {
  userId?: string;
  name?: string;
  role: Role;
  apiKey?: string;
};

const STORAGE_KEY = "fr_session_v1";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);

    const role: Role =
      s?.role === "admin" || s?.role === "researcher" ? s.role : "viewer";

    return {
      userId: typeof s?.userId === "string" ? s.userId : undefined,
      name: typeof s?.name === "string" ? s.name : undefined,
      role,
      apiKey: typeof s?.apiKey === "string" ? s.apiKey : undefined,
    };
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setReady(true);
  }, []);

  return {
    session,
    ready,
    refresh: () => setSessionState(getSession()),
  };
}

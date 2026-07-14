import { cookies } from "next/headers";
import { isValidSessionCookieValue, SESSION_COOKIE_NAME } from "./session";

// Defense-in-depth check for use inside API routes / server components.
// The middleware is the primary gate, but routes double-check so a
// misconfigured matcher can't accidentally expose the Anthropic proxy.
export async function hasValidSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value);
}

export async function getSessionValue(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value;
}

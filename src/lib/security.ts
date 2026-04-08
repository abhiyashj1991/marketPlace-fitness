/**
 * Lightweight request-origin verification for state-changing API routes.
 *
 * This is a defense-in-depth check, NOT a substitute for real auth. It blocks
 * naive cross-site POSTs by requiring the Origin or Referer header to match
 * the request host. Browsers always set one of these on cross-origin POSTs;
 * an attacker site cannot forge them.
 *
 * In development, all requests are allowed so curl/Postman work for testing.
 */
export function checkRequestOrigin(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // No Origin and no Referer on a POST is suspicious in production.
  return false;
}

import { NextRequest, NextResponse } from "next/server";

/**
 * HTTP Basic Auth gate for /admin/* and /api/admin/*.
 *
 * Credentials come from ADMIN_USER and ADMIN_PASSWORD environment variables.
 * If either env var is missing, the middleware FAILS CLOSED (returns 503)
 * rather than serving the admin section unauthenticated.
 *
 * Constant-time comparison is used so failed attempts don't leak the
 * difference between "wrong username" and "wrong password" via timing.
 *
 * Runs on the Edge runtime (Next.js middleware default), so we use Web APIs
 * (atob, no Node `crypto` module).
 */

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Marketplace Fitness Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail closed if not configured. Better a 503 than an open admin portal.
  if (!adminUser || !adminPassword) {
    return new NextResponse(
      "Admin auth is not configured. Set ADMIN_USER and ADMIN_PASSWORD environment variables in Vercel (or .env locally).",
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(authHeader.slice(6).trim());
  } catch {
    return unauthorized();
  }

  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) return unauthorized();

  const user = decoded.slice(0, colonIdx);
  const password = decoded.slice(colonIdx + 1);

  // Run BOTH comparisons (don't short-circuit) so timing doesn't reveal
  // whether the username matched.
  const userOk = constantTimeEqual(user, adminUser);
  const passOk = constantTimeEqual(password, adminPassword);

  if (!userOk || !passOk) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

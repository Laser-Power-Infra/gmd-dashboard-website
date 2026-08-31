import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

/**
 * Proxy (Next.js 16 renamed `middleware` -> `proxy`).
 *
 * PURPOSE: an optional FIRST-LINE gate that blocks and redirects anonymous
 * requests BEFORE any page renders, so visitors without a session never pay
 * the cost of rendering a protected page. It is NOT the security authority —
 * the DB-backed checks in the layout/server actions remain the real gate.
 *
 * ROLE ENFORCEMENT: the proxy cannot read the user's role (no readable role
 * cookie, no DB access at the edge). A signed-in USER reaching /admin/* is
 * blocked by `requireAdmin()` in the admin layout. The proxy's job is simply
 * to reject requests that carry NO session at all.
 *
 * COVERAGE (matcher): only /admin/* and /cost run through this file.
 * Everything else (public marketing pages, /login, /register, static assets,
 * server functions on other routes) is untouched.
 */
export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // /cost — must be signed in.
  if (pathname === '/cost' && !session) {
    return redirectToLogin(request, '/cost');
  }

  // /admin/* — must be signed in. (Role check happens in the layout.)
  if (pathname.startsWith('/admin') && !session) {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

/** Redirect to /login, remembering where the user wanted to go. */
function redirectToLogin(request: NextRequest, nextPath: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', nextPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/cost'],
};

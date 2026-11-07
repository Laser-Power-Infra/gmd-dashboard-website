import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * First-line gate: anonymous requests to /admin/*, /cost and /purchase are redirected to
 * /login before any page renders. Role checks happen in the layouts
 * (requireAdmin / requireAuth), which remain the real security authority.
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  if (token) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/cost', '/purchase'],
};

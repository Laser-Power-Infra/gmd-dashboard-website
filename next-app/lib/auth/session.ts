import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * Custom session management (no NextAuth needed).
 *
 * HOW IT WORKS:
 *  - On login we generate a long random token (the "session token").
 *  - We store ONLY the SHA-256 hash of that token in the database.
 *  - The raw token is sent to the browser as an httpOnly cookie.
 *  - On every protected request we read the cookie, hash it, and look up
 *    the matching row in the `sessions` table.
 *
 * WHY HASH THE TOKEN IN THE DB:
 *  If the database ever leaks, the attacker only gets hashes — the raw
 *  cookies in browsers are useless without the matching DB row, and the
 *  DB rows are useless without the raw cookies. Nothing is directly reusable.
 *
 * WHY DB-BACKED SESSIONS:
 *  - Logging out deletes the row immediately (server-side revocation).
 *  - Changing a user's role takes effect on the very next request.
 *    (A pure JWT/cookie approach can't be revoked until it expires.)
 */

export const SESSION_COOKIE = 'gmd_session';

/** Sessions live for 7 days. */
const SESSION_DAYS = 7;

/** One-way hash of a raw session token — this is what we store in the DB. */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Generate a fresh cryptographically-strong session token. */
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a session for a user: insert the hashed token in the DB and set
 * the httpOnly cookie with the raw token. Call this from a server action
 * (e.g. the login action) — cookies can only be set in a server function.
 */
export async function createSession(userId: string): Promise<void> {
  const token = generateToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);

  // Store the HASH of the token in the sessions table.
  await prisma.session.create({
    data: {
      sessionToken: hashToken(token),
      userId,
      expires,
    },
  });

  // Send the RAW token to the browser as a cookie.
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // JS in the browser cannot read this cookie (XSS protection)
    sameSite: 'lax', // sent on same-site navigation, blocked cross-site
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    path: '/',
    expires,
  });
}

/**
 * Resolve the currently signed-in user (or null).
 *
 * Reads the session cookie -> hashes it -> looks up the `sessions` row ->
 * joins the user. Also deletes expired sessions defensively.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;

  // Expired session? Clean it up and treat as logged out.
  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

/**
 * Destroy the current session: delete the DB row and clear the cookie.
 * Call from the logout server action.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session
      .deleteMany({ where: { sessionToken: hashToken(token) } })
      .catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE);
}

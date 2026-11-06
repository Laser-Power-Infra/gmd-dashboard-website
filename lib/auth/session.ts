import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

/** Signed-in user from the NextAuth JWT session, or null. */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

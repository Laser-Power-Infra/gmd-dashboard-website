import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * Admin nav button (server component).
 *
 * Renders the "Admin" link ONLY for users with an elevated role (ADMIN or
 * DEVELOPER). It reads the real, httpOnly session cookie on the server and
 * resolves the user from the DB — no readable role cookie involved.
 *
 * The parent Header is a client component, so the root layout renders this
 * server component and passes its output to Header as a slot prop. When the
 * user is not elevated, this renders nothing and the button is absent.
 *
 * `variant` controls placement:
 *  - "desktop" -> the skewed brand button next to "Get Quote"
 *  - "mobile"  -> a row inside the mobile drawer nav list
 */

type AdminNavSlotProps = {
  variant: 'desktop' | 'mobile';
};

export default async function AdminNavSlot({ variant }: AdminNavSlotProps) {
  const user = await getCurrentUser();
  const elevated = user && (user.role === 'ADMIN' || user.role === 'DEVELOPER');
  if (!elevated) return null;

  if (variant === 'mobile') {
    return (
      <li>
        <Link href="/admin/cost-requests">Admin</Link>
      </li>
    );
  }

  return (
    <Link
      href="/admin/cost-requests"
      className="btn-quote btn-admin"
      style={{ fontSize: '0.9rem', padding: '12px 22px' }}
    >
      <span className="btn-quote-inner">Admin</span>
    </Link>
  );
}

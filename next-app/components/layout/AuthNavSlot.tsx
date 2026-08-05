import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { logoutAction } from '@/lib/auth/actions';

/**
 * Sign In / Sign Out control (server component).
 *
 * Reads the real, httpOnly session cookie on the server:
 *  - Not signed in -> a "Sign In" link to /login.
 *  - Signed in     -> a "Sign Out" button that runs the logoutAction.
 *
 * The parent Header is a client component, so the root layout renders this
 * server component and passes its output to Header as a slot prop.
 *
 * `variant` controls placement:
 *  - "desktop" -> the skewed brand button in the top-right nav actions
 *  - "mobile"  -> a row inside the mobile drawer nav list
 */

type AuthNavSlotProps = {
  variant: 'desktop' | 'mobile';
};

export default async function AuthNavSlot({ variant }: AuthNavSlotProps) {
  const user = await getCurrentUser();

  // Mobile: render a list item for the drawer.
  if (variant === 'mobile') {
    return user ? (
      <li>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full cursor-pointer border-none bg-transparent p-0 text-left text-[0.95rem] text-[var(--color-text-dark)]"
          >
            Sign Out
          </button>
        </form>
      </li>
    ) : (
      <li>
        <Link href="/login">Sign In</Link>
      </li>
    );
  }

  // Desktop: skewed brand button matching "Get Quote".
  if (user) {
    return (
      <form action={logoutAction}>
        <button type="submit" className="btn-quote btn-auth">
          <span className="btn-quote-inner">Sign Out</span>
        </button>
      </form>
    );
  }

  return (
    <Link href="/login" className="btn-quote btn-auth">
      <span className="btn-quote-inner">Sign In</span>
    </Link>
  );
}

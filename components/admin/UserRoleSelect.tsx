'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { updateRoleAction } from '@/lib/auth/actions';

/**
 * Per-row role dropdown on the /admin/users page (DEVELOPER only).
 *
 * When the selected role changes, `updateRoleAction` is dispatched. The
 * server action re-checks that the caller is a DEVELOPER, blocks demoting
 * yourself, updates the user's role in the DB, and revalidates the page.
 *
 * WHY CONTROLLED:
 *  Using defaultValue meant React never updated the visible selection when
 *  the server re-rendered the page after a role change — the UI stayed stale
 *  until a manual refresh. Now the select is controlled via local state, and
 *  a useEffect syncs it whenever the server pushes a new currentRole, so the
 *  dropdown reflects the change immediately.
 *
 * The dropdown is disabled for the row showing your OWN account, so you
 * can't accidentally lock yourself out.
 */

type UserRoleSelectProps = {
  userId: string;
  currentRole: string;
  isSelf: boolean;
};

export default function UserRoleSelect({ userId, currentRole, isSelf }: UserRoleSelectProps) {
  const [, formAction, isPending] = useActionState(updateRoleAction, { ok: false });

  // Local state drives the visible selection...
  const [role, setRole] = useState(currentRole);

  // ...and stays in sync when the server re-renders with an updated role.
  // This is the documented React pattern for "adjusting state when a prop
  // changes" (no useEffect, so it satisfies react-hooks/set-state-in-effect).
  const [prevRole, setPrevRole] = useState(currentRole);
  if (prevRole !== currentRole) {
    setPrevRole(currentRole);
    setRole(currentRole);
  }

  return (
    <div className="flex items-center gap-2">
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select
          name="role"
          value={role}
          disabled={isSelf || isPending}
          onChange={(e) => {
            // Update the visible value immediately...
            setRole(e.target.value);
            // ...then dispatch the action using the native form action so the
            // hidden userId field is included automatically.
            e.currentTarget.form?.requestSubmit();
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DEVELOPER">DEVELOPER</option>
        </select>
      </form>

      {isSelf && (
        <span className="text-xs text-slate-400" title="You cannot change your own role">
          (you)
        </span>
      )}
    </div>
  );
}

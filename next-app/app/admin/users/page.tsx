import { prisma } from '@/lib/prisma';
import { requireDeveloper } from '@/lib/auth/require-auth';
import UserRoleSelect from '@/components/admin/UserRoleSelect';

/**
 * /admin/users — role management page (DEVELOPER only).
 *
 * Lists every user with a per-row role dropdown. The DEVELOPER can promote
 * or demote any account (USER <-> ADMIN <-> DEVELOPER). Demoting yourself is
 * blocked inside UserRoleSelect / updateRoleAction.
 */
export default async function AdminUsersPage() {
  // Only a DEVELOPER can reach this page.
  const me = await requireDeveloper();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">User Roles</h1>
        <p className="text-sm text-slate-500">
          Assign or remove ADMIN / DEVELOPER roles. Changes apply immediately.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {u.name ?? '—'}
                  {u.id === me.id && (
                    <span className="ml-2 rounded-full bg-[#8a4f50]/10 px-2 py-0.5 text-xs font-bold text-[#8a4f50]">
                      you
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect
                    userId={u.id}
                    currentRole={u.role}
                    isSelf={u.id === me.id}
                  />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Intl.DateTimeFormat('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

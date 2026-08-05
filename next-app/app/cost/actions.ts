'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import {
  costRequestSchema,
  type CostRequestFormState,
  type CostRequestInput,
} from '@/lib/schemas/cost';

/**
 * Server action that handles a cost request submission from the /cost form.
 *
 * The signed-in user is resolved from the session cookie and stored on the
 * CostRequest row (userId), so each submission is linked to its owner. A
 * normal user later sees only their own rows on /cost, while admins/developers
 * see everything on /admin/cost-requests.
 */
export async function submitCostRequest(
  _prevState: CostRequestFormState,
  formData: FormData
): Promise<CostRequestFormState> {
  const input: CostRequestInput = {
    name: formData.get('fullName')?.toString() ?? '',
    company: formData.get('company')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    gst: formData.get('gstNumber')?.toString() ?? '',
  };

  const parsed = costRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Only signed-in users can submit (the /cost page is gated by requireAuth).
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      errors: {
        name: ['You must be signed in to submit a request.'],
      },
    };
  }

  try {
    await prisma.costRequest.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error('Failed to save cost request:', err);
    return {
      ok: false,
      errors: {
        name: ['Something went wrong while saving your request. Please try again.'],
      },
    };
  }
}

'use server';

import { prisma } from '@/lib/prisma';
import {
  costRequestSchema,
  type CostRequestFormState,
  type CostRequestInput,
} from '@/lib/schemas/cost';

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

  try {
    await prisma.costRequest.create({
      data: parsed.data,
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

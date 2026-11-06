'use client';

import { useState, useActionState, startTransition } from 'react';
import type { FormEvent } from 'react';
import { Send, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import { costErrors, costRequestSchema, type CostRequestFormState } from '@/lib/schemas/cost';
import { QUOTE_VALVE_TYPES } from '@/app/api/enquiry/schema';
import { submitCostRequest } from '@/app/cost/actions';

const INITIAL_STATE: CostRequestFormState = { ok: false };

type ItemDraft = {
  valveType: string;
  size: string;
  pressure: string;
  material: string;
  endConnection: string;
  quantity: string;
  remarks: string;
};

const EMPTY_ITEM: ItemDraft = {
  valveType: '',
  size: '',
  pressure: '',
  material: '',
  endConnection: '',
  quantity: '1',
  remarks: '',
};

const ITEM_TEXT_FIELDS: { key: keyof ItemDraft; label: string; placeholder: string }[] = [
  { key: 'pressure', label: 'Pressure Rating', placeholder: 'e.g. PN 16' },
  { key: 'material', label: 'Material', placeholder: 'e.g. Ductile Iron' },
  { key: 'endConnection', label: 'End Connection', placeholder: 'e.g. Flanged' },
];

const inputClass = (error?: string) =>
  `w-full rounded-md border px-4 py-3 text-gray-900 bg-slate-50 placeholder-gray-400 shadow-sm transition-colors focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] ${
    error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
  }`;

const labelClass = 'mb-1 text-xs font-bold uppercase text-gray-700';

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{error}</p>;
}

export default function CostForm() {
  const [state, formAction, isPending] = useActionState(submitCostRequest, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState<Record<string, string> | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>([EMPTY_ITEM]);

  const errors = clientErrors ?? state.errors ?? {};
  const showSuccess = state.ok && !dismissed;

  const updateItem = (index: number, key: keyof ItemDraft, value: string) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = costRequestSchema.safeParse({
      name: fd.get('fullName'),
      company: fd.get('company'),
      email: fd.get('email'),
      gst: fd.get('gstNumber'),
      items,
    });

    if (!parsed.success) {
      setClientErrors(costErrors(parsed.error));
      return;
    }

    setClientErrors(null);
    setDismissed(false);
    startTransition(() => {
      formAction(fd);
    });
  };

  if (showSuccess) {
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-800">Request Submitted!</h2>
        <p className="mb-6 text-gray-500">
          Thank you for your interest. Our team will contact you shortly to provide your custom quotation.
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            setItems([EMPTY_ITEM]);
          }}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-30! text-sm font-bold text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b3e41] focus:ring-offset-2"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-gray-100 bg-white p-6 sm:p-8! shadow-lg">
      <h2 className="mb-6 border-b border-gray-200 pb-4 text-center text-2xl font-bold text-gray-800">
        Request a Cost Estimate
      </h2>

      {/* action={formAction} lets the form POST to the server action even if
          hydration fails; onSubmit runs first when JS is present. */}
      <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div className="flex flex-col">
            <label htmlFor="fullName" className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input id="fullName" name="fullName" type="text" placeholder="e.g. Alok Das" className={inputClass(errors.name)} />
            <FieldError error={errors.name} />
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <label htmlFor="company" className={labelClass}>
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Industrial Enterprises Pvt Ltd"
              className={inputClass(errors.company)}
            />
            <FieldError error={errors.company} />
          </div>

          {/* Email Address */}
          <div className="flex flex-col">
            <label htmlFor="email" className={labelClass}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input id="email" name="email" type="email" placeholder="name@company.com" className={inputClass(errors.email)} />
            <FieldError error={errors.email} />
          </div>

          {/* GST Number */}
          <div className="flex flex-col">
            <label htmlFor="gstNumber" className={labelClass}>
              GST Number <span className="text-red-500">*</span>
            </label>
            <input
              id="gstNumber"
              name="gstNumber"
              maxLength={15}
              placeholder="e.g. 19ABCDE1234F1Z5"
              className={`uppercase ${inputClass(errors.gst)}`}
            />
            {errors.gst ? (
              <FieldError error={errors.gst} />
            ) : (
              <p className="mt-1 text-xs text-gray-500">15-character GSTIN, e.g. 19ABCDE1234F1Z5</p>
            )}
          </div>
        </div>

        {/* Items */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-sm font-bold uppercase text-gray-800">
            Items <span className="text-red-500">*</span>
          </legend>
          <FieldError error={errors.items} />

          {items.map((item, index) => {
            const err = (key: string) => errors[`items.${index}.${key}`];
            const id = (key: string) => `item-${index}-${key}`;
            return (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Item {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                      className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor={id('valveType')} className={labelClass}>
                      Valve Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={id('valveType')}
                      value={item.valveType}
                      onChange={(e) => updateItem(index, 'valveType', e.target.value)}
                      className={inputClass(err('valveType'))}
                    >
                      <option value="">Select type</option>
                      {QUOTE_VALVE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <FieldError error={err('valveType')} />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor={id('size')} className={labelClass}>
                      Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={id('size')}
                      type="text"
                      placeholder='e.g. DN 300 / 12"'
                      value={item.size}
                      onChange={(e) => updateItem(index, 'size', e.target.value)}
                      className={inputClass(err('size'))}
                    />
                    <FieldError error={err('size')} />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor={id('quantity')} className={labelClass}>
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={id('quantity')}
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className={inputClass(err('quantity'))}
                    />
                    <FieldError error={err('quantity')} />
                  </div>

                  {ITEM_TEXT_FIELDS.map(({ key, label, placeholder }) => (
                    <div key={key} className="flex flex-col">
                      <label htmlFor={id(key)} className={labelClass}>
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={id(key)}
                        type="text"
                        placeholder={placeholder}
                        value={item[key]}
                        onChange={(e) => updateItem(index, key, e.target.value)}
                        className={inputClass(err(key))}
                      />
                      <FieldError error={err(key)} />
                    </div>
                  ))}

                  <div className="flex flex-col sm:col-span-2">
                    <label htmlFor={id('remarks')} className={labelClass}>
                      Specification / Remarks
                    </label>
                    <textarea
                      id={id('remarks')}
                      rows={2}
                      placeholder="Standard, operation, testing or any other requirement"
                      value={item.remarks}
                      onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                      className={inputClass(err('remarks'))}
                    />
                    <FieldError error={err('remarks')} />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, EMPTY_ITEM])}
            className="flex items-center justify-center gap-2 rounded-md border border-dashed border-[#7b3e41] px-4 py-2 text-sm font-bold text-[#7b3e41] hover:bg-[#7b3e41]/5"
          >
            <Plus className="h-4 w-4" /> Add another item
          </button>
        </fieldset>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-[#7b3e41] px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#5a2c2f] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Request</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
          {Object.keys(errors).length > 0 && (
            <p className="mt-2 text-center text-xs font-medium text-red-500">
              Please fix the highlighted fields before submitting.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

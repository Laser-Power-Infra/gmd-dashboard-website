'use client';

import { startTransition, useActionState, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';

import { submitCostRequest } from '@/app/cost/actions';
import type { CostFormOptions, CostLookupField } from '@/lib/lookupOptions';
import { costErrors, costRequestSchema, type CostRequestFormState } from '@/lib/schemas/cost';
import s from './cost.module.css';

type Draft = {
  valveType: string;
  size: string;
  pressure: string;
  material: string;
  endConnection: string;
  quantity: string;
  remarks: string;
};

const EMPTY: Draft = { valveType: '', size: '', pressure: '', material: '', endConnection: '', quantity: '1', remarks: '' };
const MAX_LINES = 50;

const SELECTS: { key: CostLookupField; label: string; placeholder: string }[] = [
  { key: 'valveType', label: 'Valve type', placeholder: 'Choose a type' },
  { key: 'size', label: 'Size', placeholder: 'Choose' },
  { key: 'pressure', label: 'Pressure', placeholder: 'Choose' },
  { key: 'material', label: 'Material', placeholder: 'Choose' },
];

const INITIAL: CostRequestFormState = { ok: false };

/**
 * Made-to-order estimate request. Same server action and schema as /cost;
 * name and email come from the account so a signed-in buyer never retypes them.
 */
export default function EstimateForm({
  options,
  account,
}: {
  options: CostFormOptions;
  account: { name: string | null; email: string; company: string | null; gst: string | null };
}) {
  const [state, formAction, pending] = useActionState(submitCostRequest, INITIAL);
  const [clientErrors, setClientErrors] = useState<Record<string, string> | null>(null);
  const [lines, setLines] = useState<Draft[]>([EMPTY]);
  const [sentAt, setSentAt] = useState<CostRequestFormState | null>(null);

  const errors = clientErrors ?? (state === sentAt ? {} : (state.errors ?? {}));
  const set = (n: number, key: keyof Draft, value: string) =>
    setLines((prev) => prev.map((l, i) => (i === n ? { ...l, [key]: value } : l)));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = costRequestSchema.safeParse({
      name: fd.get('fullName'),
      company: fd.get('company'),
      email: fd.get('email'),
      gst: fd.get('gstNumber'),
      items: lines,
    });
    if (!parsed.success) {
      setClientErrors(costErrors(parsed.error));
      return;
    }
    setClientErrors(null);
    startTransition(() => formAction(fd));
  };

  if (state.ok && state !== sentAt) {
    return (
      <div className={s.done} role="status">
        <span className={s.doneMark} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 12l16-8-6 16-2.5-6.5z" />
          </svg>
        </span>
        <h2>Estimate request sent</h2>
        <p>Our sales team will price it and email you. It now appears under Orders.</p>
        <Link href="/cost?tab=orders" className={s.primary}>
          View my orders
        </Link>
        <button
          type="button"
          className={s.textButton}
          onClick={() => {
            setSentAt(state);
            setLines([EMPTY]);
          }}
        >
          Ask for another estimate
        </button>
      </div>
    );
  }

  const err = (key: string) => errors[key];
  const errorCount = Object.keys(errors).length;

  return (
    <form action={formAction} onSubmit={onSubmit} className={s.form} noValidate>
      <input type="hidden" name="items" value={JSON.stringify(lines)} />
      <input type="hidden" name="email" value={account.email} />

      <section className={s.block} aria-labelledby="who">
        <h2 id="who" className={s.blockTitle}>
          Who it&apos;s for
        </h2>
        <div className={s.grid2}>
          {account.name ? (
            <div className={s.readonly}>
              <span className={s.label}>You</span>
              <p>
                {account.name}
                <span>{account.email}</span>
              </p>
              <input type="hidden" name="fullName" value={account.name} />
              {err('name') && <p className={s.fieldError}>{err('name')}. Update your name in your account.</p>}
            </div>
          ) : (
            <Field id="fullName" label="Your name" error={err('name')}>
              <input id="fullName" name="fullName" className={s.input} autoComplete="name" aria-invalid={!!err('name')} />
            </Field>
          )}
          <Field id="company" label="Company" error={err('company')}>
            <input
              id="company"
              name="company"
              className={s.input}
              defaultValue={account.company ?? ''}
              autoComplete="organization"
              maxLength={150}
              aria-invalid={!!err('company')}
            />
          </Field>
          <Field id="gstNumber" label="GSTIN" hint="15 characters, e.g. 19ABCDE1234F1Z5" error={err('gst')}>
            <input
              id="gstNumber"
              name="gstNumber"
              className={`${s.input} ${s.upper}`}
              defaultValue={account.gst ?? ''}
              maxLength={15}
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={!!err('gst')}
            />
          </Field>
        </div>
      </section>

      <section className={s.block} aria-labelledby="valves">
        <h2 id="valves" className={s.blockTitle}>
          Valves
        </h2>
        {err('items') && <p className={s.fieldError}>{err('items')}</p>}

        <ol className={s.valveList}>
          {lines.map((line, n) => {
            const id = (k: string) => `v-${n}-${k}`;
            const e = (k: string) => err(`items.${n}.${k}`);
            return (
              <li key={n} className={s.valve}>
                <div className={s.valveHead}>
                  <span>Valve {n + 1}</span>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      className={s.textButtonSmall}
                      onClick={() => setLines((prev) => prev.filter((_, i) => i !== n))}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className={s.valveGrid}>
                  {SELECTS.map(({ key, label, placeholder }) => (
                    <Field key={key} id={id(key)} label={label} error={e(key)} className={key === 'valveType' ? s.wide : ''}>
                      <select
                        id={id(key)}
                        className={s.input}
                        value={line[key]}
                        onChange={(ev) => set(n, key, ev.target.value)}
                        aria-invalid={!!e(key)}
                      >
                        <option value="">{placeholder}</option>
                        {options[key].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ))}
                  <Field id={id('endConnection')} label="End connection" error={e('endConnection')}>
                    <input
                      id={id('endConnection')}
                      className={s.input}
                      value={line.endConnection}
                      placeholder="e.g. Flanged"
                      maxLength={100}
                      onChange={(ev) => set(n, 'endConnection', ev.target.value)}
                      aria-invalid={!!e('endConnection')}
                    />
                  </Field>
                  <Field id={id('quantity')} label="Quantity" error={e('quantity')}>
                    <input
                      id={id('quantity')}
                      className={`${s.input} ${s.num}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={9999}
                      value={line.quantity}
                      onChange={(ev) => set(n, 'quantity', ev.target.value)}
                      aria-invalid={!!e('quantity')}
                    />
                  </Field>
                  <Field id={id('remarks')} label="Specification notes" optional error={e('remarks')} className={s.full}>
                    <input
                      id={id('remarks')}
                      className={s.input}
                      value={line.remarks}
                      maxLength={500}
                      placeholder="Standard, operation, testing or anything else we should know"
                      onChange={(ev) => set(n, 'remarks', ev.target.value)}
                    />
                  </Field>
                </div>
              </li>
            );
          })}
        </ol>

        {lines.length < MAX_LINES && (
          <button type="button" className={s.addValve} onClick={() => setLines((prev) => [...prev, EMPTY])}>
            Add another valve
          </button>
        )}
      </section>

      <div className={s.submitRow}>
        {errorCount > 0 && (
          <p className={s.formError} role="alert">
            {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`} They are marked
            above.
          </p>
        )}
        <button type="submit" className={s.primary} disabled={pending}>
          {pending ? 'Sending…' : 'Send estimate request'}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  optional,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${s.field} ${className}`}>
      <label htmlFor={id} className={s.label}>
        {label}
        {optional && <span> (optional)</span>}
      </label>
      {children}
      {error ? <p className={s.fieldError}>{error}</p> : hint ? <p className={s.hint}>{hint}</p> : null}
    </div>
  );
}

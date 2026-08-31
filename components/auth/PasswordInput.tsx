'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Password input with a show/hide eye toggle.
 *
 * The eye button switches the input between `password` and `text`. It uses
 * `type="button"` so clicking it never submits the enclosing form.
 * Styling matches every other input on the login/register pages.
 */

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
};

export default function PasswordInput({
  id,
  name,
  placeholder,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 pr-11 text-gray-900 placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-gray-600 focus:outline-none"
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const CONTROLE =
  "block min-h-12 w-full rounded-2xl border-2 bg-white px-4 py-2.5 text-base text-ink placeholder:text-stone-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-200 disabled:bg-stone-100";

interface Comum {
  label: string;
  erro?: string;
  dica?: string;
}

function Envoltorio({
  id,
  label,
  erro,
  dica,
  children,
}: Comum & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-bold text-ink">
        {label}
      </label>
      {children}
      {dica && !erro && <p className="mt-1 text-sm text-ink-soft">{dica}</p>}
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-1 text-sm font-semibold text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

export function Input({
  label,
  erro,
  dica,
  className = "",
  ...rest
}: Comum & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Envoltorio id={id} label={label} erro={erro} dica={dica}>
      <input
        id={id}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${CONTROLE} ${erro ? "border-red-600" : "border-stone-300"} ${className}`}
        {...rest}
      />
    </Envoltorio>
  );
}

export function Select({
  label,
  erro,
  dica,
  children,
  className = "",
  ...rest
}: Comum & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Envoltorio id={id} label={label} erro={erro} dica={dica}>
      <select
        id={id}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${CONTROLE} ${erro ? "border-red-600" : "border-stone-300"} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Envoltorio>
  );
}

export function Textarea({
  label,
  erro,
  dica,
  className = "",
  ...rest
}: Comum & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Envoltorio id={id} label={label} erro={erro} dica={dica}>
      <textarea
        id={id}
        rows={3}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${CONTROLE} ${erro ? "border-red-600" : "border-stone-300"} ${className}`}
        {...rest}
      />
    </Envoltorio>
  );
}

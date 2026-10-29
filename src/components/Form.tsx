import type { ReactNode } from "react";

export const inputClass =
  "ui w-full rounded-xl border border-ink/25 bg-transparent px-4 py-2.5 placeholder:text-muted";

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="ui font-semibold">
        {label}
      </label>
      {hint && <p className="ui mt-0.5 text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="ui mt-4 text-violet">
      {children}
    </p>
  );
}

export const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

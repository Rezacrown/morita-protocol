"use client";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs tracking-widest uppercase text-black/40">
        {label}
      </label>
      {children}
    </div>
  );
}

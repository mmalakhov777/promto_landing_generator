"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

type FormFieldProps = InputProps | TextareaProps;

export function FormField(props: FormFieldProps) {
  const { label, error, hint, multiline, ...rest } = props;
  const id = rest.id || label.toLowerCase().replace(/\s+/g, "-");

  const inputClasses = `w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none ${
    error
      ? "border-error focus:ring-1 focus:ring-error"
      : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
  }`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${inputClasses} min-h-[80px] resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClasses}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

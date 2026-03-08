import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
}

interface InputProps
  extends
    BaseInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  as?: "input";
}

interface TextareaProps
  extends
    BaseInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  as: "textarea";
}

type InputComponentProps = InputProps | TextareaProps;

export function Input(props: InputComponentProps) {
  const generatedId = useId();
  const { label, error, as = "input", id, ...rest } = props;

  const inputId = id || generatedId;

  const baseInputStyles = `
    w-full px-4 py-3 rounded-xl 
    border border-gray-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    bg-white text-black
    placeholder:text-gray-300
    transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs tracking-widest uppercase text-gray-400 block"
        >
          {label}
        </label>
      )}
      {as === "textarea" ? (
        <textarea
          id={inputId}
          className={baseInputStyles}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          type="text"
          className={baseInputStyles}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

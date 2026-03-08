"use client";

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <div className="pt-12">
      <button
        disabled={isLoading}
        type="submit"
        className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Sign & Encrypt Invoice"}
      </button>
    </div>
  );
}

"use client";

export interface PaymentLoadingViewProps {
  message?: string;
}

export function PaymentLoadingView({
  message = "Verifying Transaction...",
}: PaymentLoadingViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-2 border-black/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-black/40 tracking-widest uppercase text-sm animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

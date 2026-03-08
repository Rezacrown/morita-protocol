import { ReactNode } from "react";

type BadgeVariant = "status" | "role" | "filter";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  status?: "Settled" | "Awaiting Payment";
  role?: "Creator" | "Payer";
  active?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "role",
  status,
  role,
  active = false,
  className = "",
}: BadgeProps) {
  // Status variant
  if (variant === "status" && status) {
    return (
      <span
        className={`
          inline-flex items-center text-xs tracking-widest uppercase
          ${status === "Settled" ? "text-black" : "text-black/40"}
          ${className}
        `}
      >
        {status === "Settled" && (
          <span className="w-1.5 h-1.5 rounded-full bg-black mr-2"></span>
        )}
        {status === "Awaiting Payment" && (
          <span className="w-1.5 h-1.5 rounded-full border border-black/40 mr-2"></span>
        )}
        {status}
      </span>
    );
  }

  // Role variant
  if (variant === "role" && role) {
    return (
      <span
        className={`
          inline-flex items-center justify-center 
          px-3 py-1 rounded-full 
          text-[10px] tracking-widest uppercase
          ${
            role === "Creator"
              ? "bg-black/5 text-black"
              : "border border-black/20 text-black/60"
          }
          ${className}
        `}
      >
        {role}
      </span>
    );
  }

  // Filter variant
  if (variant === "filter") {
    return (
      <span
        className={`
          px-4 py-1.5 rounded-full 
          text-[10px] tracking-widest uppercase 
          transition-colors
          ${
            active
              ? "bg-black text-white"
              : "border border-black/20 text-black/60 hover:border-black/40"
          }
          ${className}
        `}
      >
        {children}
      </span>
    );
  }

  // Default fallback
  return (
    <span
      className={`
        inline-flex items-center justify-center 
        px-3 py-1 rounded-full 
        text-[10px] tracking-widest uppercase
        bg-black/5 text-black
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: "Settled" | "Awaiting Payment";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs tracking-widest uppercase ${
        status === "Settled" ? "text-black" : "text-black/40"
      }`}
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

interface RoleBadgeProps {
  role: "Creator" | "Payer";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] tracking-widest uppercase ${
        role === "Creator"
          ? "bg-black/5 text-black"
          : "border border-black/20 text-black/60"
      }`}
    >
      {role}
    </span>
  );
}

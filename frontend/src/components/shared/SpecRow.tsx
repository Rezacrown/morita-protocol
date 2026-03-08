export function SpecRow({
  label,
  value,
  isMono = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-black/10">
      <div className="sm:w-1/3 text-xs tracking-widest uppercase text-black/40 mb-2 sm:mb-0 pt-1">
        {label}
      </div>
      <div
        className={`sm:w-2/3 ${
          isMono ? "font-mono text-sm" : "font-light"
        } text-black/80`}
      >
        {value}
      </div>
    </div>
  );
}

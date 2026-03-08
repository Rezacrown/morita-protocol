export function ProcessRow({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col md:flex-row py-12 md:py-16 border-b border-black/20 group hover:bg-black/[0.02] transition-colors">
      <div className="md:w-1/4 font-serif text-7xl md:text-8xl text-black/10 font-light group-hover:text-black transition-colors duration-500 leading-none mb-6 md:mb-0">
        {num}
      </div>
      <div className="md:w-1/4 pt-2">
        <h3 className="text-xs tracking-widest uppercase font-medium">
          {title}
        </h3>
      </div>
      <div className="md:w-2/4 pt-2">
        <p className="font-light text-black/60 leading-relaxed text-lg">
          {desc}
        </p>
      </div>
    </div>
  );
}

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {badge && (
        <span className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
          {badge}
        </span>
      )}

      <h2 className="mt-4 font-title text-4xl font-bold text-white md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-5 text-lg leading-8 text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
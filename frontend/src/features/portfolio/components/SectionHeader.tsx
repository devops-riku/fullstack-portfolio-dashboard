interface SectionHeaderProps {
  /** Two-digit index, e.g. "01". */
  index: string;
  title: string;
}

/**
 * Editorial section header: mono index + display title with a hairline rule.
 */
export const SectionHeader = ({ index, title }: SectionHeaderProps) => (
  <div className="mb-10 flex items-baseline gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
    <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-sky-400">
      {index} /
    </span>
    <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-ink dark:text-paper">
      {title}
    </h2>
  </div>
);

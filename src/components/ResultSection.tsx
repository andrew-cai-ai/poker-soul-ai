interface ResultSectionProps {
  title: string;
  step?: number;
  children: React.ReactNode;
}

export function ResultSection({ title, step, children }: ResultSectionProps) {
  return (
    <section className="card-mystic overflow-hidden">
      <div className="border-b border-casino-gold/10 bg-casino-dark/50 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-casino-gold">
          {step !== undefined && (
            <span className="mr-2 text-casino-gold/50">{step}.</span>
          )}
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface DestinyRowProps {
  label: string;
  value: string;
}

export function DestinyRow({ label, value }: DestinyRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="font-medium text-gray-100">{value}</span>
    </div>
  );
}

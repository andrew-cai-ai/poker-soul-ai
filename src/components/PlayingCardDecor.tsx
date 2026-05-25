export function PlayingCardDecor({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute opacity-20 ${className}`}
      aria-hidden
    >
      <div className="font-display text-6xl text-casino-gold">♠</div>
    </div>
  );
}

export function FortuneScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? "text-casino-gold"
      : score >= 50
        ? "text-casino-gold-light"
        : "text-casino-crimson";

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-casino-card"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-display text-4xl font-bold ${color}`}>
          {score}
        </span>
        <span className="text-xs tracking-widest text-gray-400">运势</span>
      </div>
    </div>
  );
}

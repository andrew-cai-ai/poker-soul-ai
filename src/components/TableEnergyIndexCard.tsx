import type { TableEnergyIndex } from "@/types/fortune";

interface TableEnergyIndexCardProps {
  index: TableEnergyIndex;
}

export function TableEnergyIndexCard({ index }: TableEnergyIndexCardProps) {
  const filled = Math.round(index.score / 10);
  const bar =
    "█".repeat(filled) + "░".repeat(Math.max(0, 10 - filled));

  return (
    <div className="card-mystic mb-5 p-6 text-center">
      <p className="font-display text-sm tracking-wider text-casino-gold/70">
        🎴 今日桌面能量
      </p>

      <p className="mt-4 font-display text-6xl font-bold leading-none text-casino-gold">
        {index.score}
        <span className="text-2xl text-gray-500"> / 100</span>
      </p>

      <div className="mt-4 font-mono text-lg tracking-widest text-casino-gold/80">
        {bar}
      </div>

      <p className="mt-5 font-display text-xl font-semibold text-casino-gold-light">
        {index.emoji} {index.label}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-gray-300">
        「{index.explanation}」
      </p>
    </div>
  );
}

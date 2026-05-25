interface SoulAvatarProps {
  suit: string;
}

export function SoulAvatar({ suit }: SoulAvatarProps) {
  return (
    <div
      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-casino-gold/30 bg-casino-dark/90 shadow-[0_0_28px_rgba(212,175,55,0.22)]"
      aria-hidden
    >
      <span className="font-display text-5xl leading-none text-casino-gold">
        {suit}
      </span>
    </div>
  );
}

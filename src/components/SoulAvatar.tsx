"use client";

import { useState } from "react";
import Image from "next/image";
import { getCharacterImagePath } from "@/lib/character-images";

interface SoulAvatarProps {
  soulTypeId: string;
  suit: string;
  alt?: string;
}

function SuitFallback({ suit }: { suit: string }) {
  return (
    <div
      className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-2xl border border-casino-gold/30 bg-casino-dark/90 shadow-[0_0_28px_rgba(212,175,55,0.22)]"
      aria-hidden
    >
      <span className="font-display text-5xl leading-none text-casino-gold">
        {suit}
      </span>
    </div>
  );
}

export function SoulAvatar({ soulTypeId, suit, alt = "牌魂角色" }: SoulAvatarProps) {
  const [failed, setFailed] = useState(false);
  const src = getCharacterImagePath(soulTypeId);

  if (!src || failed) {
    return <SuitFallback suit={suit} />;
  }

  return (
    <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-2xl border border-casino-gold/30 bg-casino-dark/90 shadow-[0_0_28px_rgba(212,175,55,0.22)]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="112px"
        className="object-cover object-top"
        onError={() => setFailed(true)}
        priority
      />
    </div>
  );
}

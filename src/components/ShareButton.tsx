"use client";

import { useState } from "react";
import type { FortuneResult } from "@/types/fortune";
import {
  trackShareClicked,
  type SharePlatform,
} from "@/lib/analytics";

interface ShareButtonProps {
  result: FortuneResult;
}

const PLATFORMS: { id: SharePlatform; label: string }[] = [
  { id: "wechat", label: "微信" },
  { id: "xiaohongshu", label: "小红书" },
  { id: "reddit", label: "Reddit" },
  { id: "copy_link", label: "复制" },
];

export function ShareButton({ result }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const {
    soulType,
    sessionEnergy,
    todayRival,
    todayAlly,
    fortuneCard,
    pokerLegend,
  } = result;

  const shareText = `🃏 Poker Soul AI — ${result.nickname} 的牌风报告

${soulType.nameZh} · ${soulType.fateTitle}
「${soulType.selfIdentity}」

⚡ ${sessionEnergy.name}

${todayRival.emoji} 今日宿敌：${todayRival.nameZh}
${todayRival.reason}

🤝 今日盟友：${todayAlly.nameZh}
${todayAlly.reason}

🎴 ${fortuneCard.nameZh}
「${fortuneCard.quoteLine1}」
「${fortuneCard.quoteLine2}」

今日像谁：${pokerLegend.nameZh}（${pokerLegend.percent}%）
${pokerLegend.reason}

#PokerSoulAI #扑克牌风`;

  async function copyShareText(platform: SharePlatform) {
    trackShareClicked(platform);
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => copyShareText(p.id)}
            className="select-chip text-xs"
          >
            {p.label}
          </button>
        ))}
      </div>
      {copied && (
        <p className="text-center text-xs text-emerald-400">✓ 已复制分享文案</p>
      )}
    </div>
  );
}

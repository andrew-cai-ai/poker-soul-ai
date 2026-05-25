"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ProMatchTracker } from "@/components/ProMatchTracker";
import { ShareButton } from "@/components/ShareButton";
import { ShareImageButton } from "@/components/ShareImageButton";
import { SoulAvatar } from "@/components/SoulAvatar";
import { TableEnergyIndexCard } from "@/components/TableEnergyIndexCard";
import { DestinyRow, ResultSection } from "@/components/ResultSection";
import { loadFortuneResult } from "@/lib/fortune-engine";
import type { FortuneResult } from "@/types/fortune";

function HandTags({ hands, variant }: { hands: string[]; variant: "lucky" | "danger" }) {
  return (
    <div className="space-y-2">
      {hands.map((entry) => {
        const [hand, reason] = entry.split(" — ");
        return (
          <div
            key={entry}
            className={`rounded-lg px-3 py-2 ${
              variant === "lucky"
                ? "bg-emerald-950/60"
                : "bg-casino-crimson/20"
            }`}
          >
            <p
              className={`font-mono text-sm font-semibold ${
                variant === "lucky" ? "text-emerald-400" : "text-red-300"
              }`}
            >
              {hand}
            </p>
            {reason && (
              <p className="mt-0.5 text-xs text-gray-400">{reason}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<FortuneResult | null>(null);

  useEffect(() => {
    const data = loadFortuneResult();
    if (!data?.tableEnergyIndex) {
      router.replace("/fortune");
      return;
    }
    setResult(data);
  }, [router]);

  if (!result) {
    return (
      <Layout showBack>
        <div className="flex flex-1 items-center justify-center">
          <p className="animate-pulse font-display text-casino-gold">
            正在生成报告…
          </p>
        </div>
      </Layout>
    );
  }

  const {
    soulType,
    pokerMirror,
    sessionEnergy,
    destiny,
    personality,
    todayRival,
    todayAlly,
    fortuneCard,
    pokerLegend,
  } = result;

  return (
    <Layout showBack>
      <div className="mb-4 text-center">
        <p className="text-xs text-gray-500">玩家</p>
        <h1 className="font-display text-2xl font-bold text-casino-gold-light">
          {result.nickname}
        </h1>
      </div>

      <TableEnergyIndexCard index={result.tableEnergyIndex} />

      <div className="space-y-5">
        <ResultSection title="牌魂类型" step={1}>
          <SoulAvatar
            soulTypeId={soulType.id}
            suit={soulType.symbol}
            alt={soulType.nameZh}
          />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-casino-gold">
              {soulType.nameZh}
            </p>
            <p className="mt-1 text-sm text-casino-gold/70">
              命格 · {soulType.fateTitle}
            </p>
          </div>

          <p className="mt-3 text-center text-xs tracking-wider text-gray-500">
            {soulType.keywords.join(" · ")}
          </p>

          <p className="mt-4 whitespace-pre-line text-center text-sm italic leading-relaxed text-gray-300">
            {soulType.selfIdentity}
          </p>

          <p className="mt-4 leading-relaxed text-gray-400">{soulType.description}</p>
        </ResultSection>

        <ResultSection title="牌桌镜像" step={2}>
          <p className="leading-relaxed text-gray-300">{pokerMirror.see}</p>
          <p className="mt-3 leading-relaxed text-gray-300">{pokerMirror.inside}</p>
          <p className="mt-3 leading-relaxed italic text-casino-gold-light/90">
            {pokerMirror.gap}
          </p>
        </ResultSection>

        <ResultSection title="本场状态" step={3}>
          <p className="font-display text-lg font-bold text-casino-gold">
            {sessionEnergy.name}
          </p>
          <p className="mt-3 leading-relaxed text-gray-300">
            {sessionEnergy.description}
          </p>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-400">注意</p>
            <p className="mt-1 text-sm text-gray-200">{sessionEnergy.danger}</p>
          </div>
        </ResultSection>

        <ResultSection title="运势信号" step={4}>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">幸运数字</p>
            {destiny.luckyNumbers.map((n) => (
              <DestinyRow
                key={n.value}
                label={String(n.value)}
                value={n.meaning}
              />
            ))}
          </div>

          <DestinyRow
            label="幸运方位"
            value={`${destiny.luckyDirection} — ${destiny.directionExplanation}`}
          />
          <DestinyRow
            label="幸运时段"
            value={`${destiny.luckyTime} — ${destiny.timeExplanation}`}
          />
          <DestinyRow
            label="幸运配色"
            value={`${destiny.luckyColor} — ${destiny.colorNote}`}
          />

          <div className="mt-4 rounded-xl border border-casino-purple/30 bg-casino-purple/10 p-3">
            <p className="text-xs font-semibold text-casino-gold">
              牌桌征兆 · {destiny.tableOmen.name}
            </p>
            <p className="mt-2 text-sm text-gray-300">{destiny.tableOmen.meaning}</p>
            <p className="mt-2 text-sm text-amber-400/90">
              提醒：{destiny.tableOmen.warning}
            </p>
          </div>
        </ResultSection>

        <ResultSection title="手牌信号" step={5}>
          <div>
            <p className="mb-2 text-xs text-gray-400">幸运手牌</p>
            <HandTags hands={destiny.luckyHands} variant="lucky" />
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs text-gray-400">避开手牌</p>
            <HandTags hands={destiny.dangerHands} variant="danger" />
          </div>
        </ResultSection>

        <ResultSection title="MBTI + 星座" step={6}>
          <p className="mb-3 text-xs text-gray-500">
            MBTI 为你所选 · 星座来自生日（未填则按每日种子推算）
          </p>
          <p className="leading-relaxed text-gray-300">
            {personality.explanation}
          </p>

          <div className="mt-4 rounded-xl border border-casino-crimson/25 bg-casino-crimson/10 p-3">
            <p className="text-xs font-semibold text-casino-crimson">
              {todayRival.emoji} 今日宿敌 · {todayRival.nameZh}
            </p>
            <p className="mt-2 text-sm text-gray-300">{todayRival.reason}</p>
            {todayRival.warning && (
              <p className="mt-2 text-sm text-amber-400/90">
                提醒：{todayRival.warning}
              </p>
            )}
          </div>

          <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
            <p className="text-xs font-semibold text-emerald-400">
              🤝 今日盟友 · {todayAlly.nameZh}
            </p>
            <p className="mt-2 text-sm text-gray-300">{todayAlly.reason}</p>
          </div>
        </ResultSection>

        <ResultSection title="今日牌语" step={7}>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-casino-gold">
              {fortuneCard.nameZh}
            </p>
          </div>
          <blockquote className="mt-4 border-l-2 border-casino-gold/40 pl-4 font-body text-lg italic leading-relaxed text-gray-200">
            <p>{fortuneCard.quoteLine1}</p>
            <p className="mt-2">{fortuneCard.quoteLine2}</p>
          </blockquote>

          <div className="mt-5 rounded-xl border border-casino-gold/20 bg-casino-gold/5 p-4">
            <ProMatchTracker proPlayer={pokerLegend.name} />
            <p className="text-xs font-semibold text-casino-gold">今日像谁</p>
            <p className="mt-2 font-display text-lg font-bold text-casino-gold-light">
              {pokerLegend.nameZh}（{pokerLegend.percent}%）
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-gray-300">
              {pokerLegend.reason}
            </p>
          </div>
        </ResultSection>

        <div className="flex flex-col gap-3">
          <ShareImageButton result={result} />
          <ShareButton result={result} />
        </div>

        <Link href="/fortune" className="btn-outline w-full text-center">
          再测一次
        </Link>
      </div>
    </Layout>
  );
}

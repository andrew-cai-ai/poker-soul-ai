import posthog from "posthog-js";
import type { FortuneInput, FortuneResult } from "@/types/fortune";

const LAST_VISIT_KEY = "poker-soul-analytics-last-visit";
const LAST_GEN_KEY = "poker-soul-analytics-last-gen";

let initialized = false;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: false,
  });
  initialized = true;
}

export function captureEvent(
  event: string,
  properties?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function getTrafficSource(): string {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return utm;
  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname || "referral";
    } catch {
      return "referral";
    }
  }
  return "direct";
}

export function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|tablet|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

export function trackAppOpened(): void {
  const today = todayKey();
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

  if (lastVisit && lastVisit !== today) {
    const days = Math.round(
      (Date.parse(`${today}T12:00:00`) - Date.parse(`${lastVisit}T12:00:00`)) /
        86400000
    );
    if (days > 0) {
      captureEvent("return_visit", { days_since_last_visit: days });
    }
  }

  localStorage.setItem(LAST_VISIT_KEY, today);

  captureEvent("app_opened", {
    source: getTrafficSource(),
    device: getDeviceType(),
  });
}

export interface GenerationMeta {
  isRegeneration: boolean;
  sameDay: boolean;
}

export function getGenerationMeta(): GenerationMeta {
  const today = todayKey();
  const lastGen = localStorage.getItem(LAST_GEN_KEY);
  return {
    isRegeneration: Boolean(lastGen),
    sameDay: lastGen === today,
  };
}

export function markGenerationComplete(): void {
  localStorage.setItem(LAST_GEN_KEY, todayKey());
}

export function destinyProps(
  input: FortuneInput,
  result: FortuneResult
): Record<string, string | number> {
  return {
    poker_type: input.gameType,
    mbti: input.mbti,
    zodiac: result.personality.zodiac.signZh,
    fortune_score: result.tableEnergyIndex.score,
    session_energy: result.sessionEnergy.id,
  };
}

export function shareProps(
  result: FortuneResult
): Record<string, string | number> {
  return {
    poker_type: result.gameType ?? "unknown",
    fortune_score: result.tableEnergyIndex.score,
  };
}

export type SharePlatform = "wechat" | "xiaohongshu" | "reddit" | "copy_link";

export function trackDestinyGenerated(
  input: FortuneInput,
  result: FortuneResult,
  meta: GenerationMeta
): void {
  if (meta.isRegeneration) {
    captureEvent("result_regenerated", { same_day: meta.sameDay });
  }
  captureEvent("destiny_generated", destinyProps(input, result));
  markGenerationComplete();
}

export function trackShareCardGenerated(result: FortuneResult): void {
  captureEvent("share_card_generated", shareProps(result));
}

export function trackShareClicked(platform: SharePlatform): void {
  captureEvent("share_clicked", { platform });
}

export function trackProMatchViewed(proPlayer: string): void {
  captureEvent("pro_match_viewed", { pro_player: proPlayer });
}

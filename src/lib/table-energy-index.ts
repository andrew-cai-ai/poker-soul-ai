import energyTiers from "@/data/table-energy-tiers.json";
import type {
  FortuneInput,
  MbtiType,
  Mood,
  RecentResult,
  TableEnergyIndex,
  ZodiacProfile,
} from "@/types/fortune";

const MBTI_DELTA: Record<MbtiType, number> = {
  INTJ: 8,
  INTP: 6,
  ENTJ: 10,
  ENTP: 10,
  INFJ: 6,
  INFP: 2,
  ENFJ: 7,
  ENFP: 9,
  ISTJ: 5,
  ISFJ: 3,
  ESTJ: 7,
  ESFJ: 6,
  ISTP: 4,
  ISFP: 2,
  ESTP: 12,
  ESFP: 8,
};

/** 星座修正（按中文名） */
const ZODIAC_DELTA: Record<string, number> = {
  白羊座: 4,
  金牛座: 2,
  双子座: 3,
  巨蟹座: 1,
  狮子座: 4,
  处女座: 4,
  天秤座: 2,
  天蝎座: 5,
  射手座: 6,
  摩羯座: 5,
  水瓶座: 4,
  双鱼座: 2,
};

const WIN_RESULTS: RecentResult[] = ["on_fire", "big_win", "small_win"];
const LOSS_RESULTS: RecentResult[] = ["small_loss", "bad_beat"];

function seededIndex(seed: number, length: number): number {
  if (length <= 0) return 0;
  return ((seed % length) + length) % length;
}

function moodResultDelta(mood: Mood, recentResult: RecentResult): number {
  let delta = 0;

  if (WIN_RESULTS.includes(recentResult)) {
    delta += recentResult === "on_fire" || recentResult === "big_win" ? 12 : 6;
  }
  if (LOSS_RESULTS.includes(recentResult)) {
    delta -= 12;
  }

  if (mood === "confident" || mood === "lucky") delta += 8;
  if (mood === "anxious") delta -= 8;
  if (mood === "revenge" || mood === "tilted") delta -= 6;

  return delta;
}

function seedRitualDelta(seed: number): number {
  return seededIndex(seed + 60, 21) - 10;
}

type TierRow = {
  min: number;
  emoji: string;
  label: string;
  explanation: string;
};

function resolveTier(score: number): TierRow {
  const tiers = energyTiers as TierRow[];
  for (const tier of tiers) {
    if (score >= tier.min) return tier;
  }
  return tiers[tiers.length - 1];
}

/** 人格(MBTI+星座) 40% + 最近状态 40% + 每日 seed 仪式感 20% */
export function calculateTableEnergyIndex(
  input: FortuneInput,
  seed: number,
  zodiac: ZodiacProfile
): TableEnergyIndex {
  const mbtiPart = MBTI_DELTA[input.mbti] ?? 0;
  const zodiacPart = ZODIAC_DELTA[zodiac.signZh] ?? 0;
  const statePart = moodResultDelta(input.mood, input.recentResult);
  const seedPart = seedRitualDelta(seed);

  const personalityWeighted = Math.round(((mbtiPart + zodiacPart) / 24) * 40);
  const stateWeighted = Math.round((statePart / 24) * 40);
  const seedWeighted = Math.round(((seedPart + 10) / 20) * 20);

  let score = personalityWeighted + stateWeighted + seedWeighted;
  score = Math.min(100, Math.max(0, score));

  const tier = resolveTier(score);

  return {
    score,
    emoji: tier.emoji,
    label: tier.label,
    explanation: tier.explanation,
  };
}

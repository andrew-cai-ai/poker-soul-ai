import soulTypesData from "@/data/soul-types.json";
import pokerMirrorsData from "@/data/poker-mirrors.json";
import sessionEnergyData from "@/data/session-energy.json";
import handsData from "@/data/hands.json";
import mbtiData from "@/data/mbti.json";
import zodiacData from "@/data/zodiac.json";
import destinyData from "@/data/destiny.json";
import personalityExplanations from "@/data/personality-explanations.json";
import tableRelationsData from "@/data/table-relations.json";
import cardPoolsData from "@/data/card-pools.json";
import pokerLegendsData from "@/data/poker-legends.json";
import { calculateTableEnergyIndex } from "@/lib/table-energy-index";
import type {
  DestinySignals,
  FortuneCard,
  FortuneInput,
  FortuneResult,
  HandPick,
  RecentResult,
  LuckyNumberPick,
  MbtiProfile,
  PersonalityLayer,
  PokerLegendMatch,
  PokerMirror,
  SessionEnergy,
  SoulType,
  TableRelation,
  ZodiacProfile,
} from "@/types/fortune";

type SoulTypeRaw = SoulType;
type ZodiacEntry = (typeof zodiacData)[number];
type SessionEnergyEntry = SessionEnergy & { id: string };
type MirrorMap = Record<string, PokerMirror>;
type RelationsMap = {
  rivals: Record<string, TableRelation>;
  allies: Record<string, TableRelation>;
};
type CardPoolsMap = Record<string, FortuneCard[]>;
type LegendEntry = {
  name: string;
  nameZh: string;
  reasons: string[];
};

const SOUL_TYPE_IDS = [
  "cold_reaper",
  "mad_dog",
  "turtle_keeper",
  "river_hunter",
  "fox_schemer",
  "tilt_asura",
  "flop_alchemist",
  "silent_reader",
] as const;

const WIN_STREAK: RecentResult[] = ["on_fire", "big_win", "small_win"];
const LOSS_STREAK: RecentResult[] = ["small_loss", "bad_beat"];

const SESSION_IDS = [
  "heater",
  "bad_beat_recovery",
  "silent_grind",
  "rush",
  "hunter",
] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededIndex(seed: number, length: number): number {
  if (length <= 0) return 0;
  return ((seed % length) + length) % length;
}

function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 每日种子：用户名 + 生日 + 当天日期 */
export function buildDailyKey(input: FortuneInput): string {
  const birthday = input.birthday ?? "";
  return `${input.nickname.trim()}|${birthday}|${todayDateString()}`;
}

export function buildDailySeed(input: FortuneInput): number {
  return hashString(buildDailyKey(input));
}

function yesterdaySeed(input: FortuneInput): number {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const birthday = input.birthday ?? "";
  return hashString(`${input.nickname.trim()}|${birthday}|${y}-${m}-${day}`);
}

function pickUniqueHandPicks(
  pool: HandPick[],
  count: number,
  seed: number
): string[] {
  const items = pool.filter((item) => item?.hand && item?.reason);
  const picked: string[] = [];
  const limit = Math.min(count, items.length);
  let s = seed;

  for (let i = 0; i < limit; i++) {
    const idx = seededIndex(s, items.length);
    const item = items[idx];
    if (!item) break;
    picked.push(`${item.hand} — ${item.reason}`);
    items.splice(idx, 1);
    s = (s * 31 + 17) | 0;
  }
  return picked;
}

function pickUniqueNumbers(
  pool: LuckyNumberPick[],
  count: number,
  seed: number
): LuckyNumberPick[] {
  const items = pool.filter((item) => item?.value != null && item?.meaning);
  const picked: LuckyNumberPick[] = [];
  const limit = Math.min(count, items.length);
  let s = seed;

  for (let i = 0; i < limit; i++) {
    const idx = seededIndex(s, items.length);
    const item = items[idx];
    if (!item) break;
    picked.push(item);
    items.splice(idx, 1);
    s = (s * 31 + 17) | 0;
  }
  return picked;
}

function selectSoulType(seed: number): SoulType {
  const types = soulTypesData as SoulTypeRaw[];
  const id = SOUL_TYPE_IDS[seededIndex(seed, SOUL_TYPE_IDS.length)];
  return types.find((t) => t.id === id) ?? types[0];
}

function getPokerMirror(soulTypeId: string): PokerMirror {
  const mirrors = pokerMirrorsData as MirrorMap;
  return (
    mirrors[soulTypeId] ?? {
      see: "牌桌上你看起来很稳。",
      inside: "其实你在给每个人画范围。",
      gap: "你出的线和真实牌力之间的缝隙，就是整局游戏。",
    }
  );
}

function selectSessionEnergy(
  input: FortuneInput,
  fortuneScore: number
): SessionEnergy {
  const states = sessionEnergyData as SessionEnergyEntry[];
  const rushed = input.mood === "tilted" || input.mood === "revenge";

  let id: (typeof SESSION_IDS)[number] = "silent_grind";
  if (WIN_STREAK.includes(input.recentResult) && fortuneScore >= 80) {
    id = "hunter";
  } else if (WIN_STREAK.includes(input.recentResult)) {
    id = "heater";
  } else if (LOSS_STREAK.includes(input.recentResult)) {
    id = "bad_beat_recovery";
  } else if (rushed) {
    id = "rush";
  }

  const e = states.find((s) => s.id === id) ?? states[2];
  return {
    id: e.id,
    name: e.name,
    description: e.description,
    danger: e.danger,
  };
}

function getTableRelation(
  soulTypeId: string,
  kind: "rivals" | "allies"
): TableRelation {
  const map = tableRelationsData as RelationsMap;
  const pool = map[kind];
  return (
    pool[soulTypeId] ?? {
      emoji: kind === "rivals" ? "🐢" : "🤝",
      nameZh: kind === "rivals" ? "未知对手" : "未知盟友",
      nameEn: "Unknown",
      reason: "桌况复杂，保持读牌。",
      warning: kind === "rivals" ? "别在情绪上头时硬打。" : undefined,
    }
  );
}

type CardPoolItem = {
  id: string;
  nameZh: string;
  quoteLine1: string;
  quoteLine2: string;
};

function selectFortuneCard(
  soulTypeId: string,
  seed: number,
  input: FortuneInput
): FortuneCard {
  const pools = cardPoolsData as CardPoolsMap;
  const personalityPool = (pools[soulTypeId] ?? pools.random) as CardPoolItem[];
  const randomPool = pools.random as CardPoolItem[];
  const allCards = [...personalityPool, ...randomPool];

  const usePersonalityPool = seededIndex(seed + 40, 10) < 7;
  const primaryPool = usePersonalityPool ? personalityPool : randomPool;

  let idx = seededIndex(seed + 41, primaryPool.length);
  let card = primaryPool[idx];

  const ySeed = yesterdaySeed(input);
  const yPool = pools[soulTypeId] ?? pools.random;
  const yesterdayCard = (yPool as CardPoolItem[])[
    seededIndex(ySeed + 41, (yPool as CardPoolItem[]).length)
  ];

  if (card && yesterdayCard && card.id === yesterdayCard.id) {
    idx = (idx + 1) % primaryPool.length;
    card = primaryPool[idx];
  }

  return {
    id: card?.id ?? "fold",
    nameZh: card?.nameZh ?? "弃牌",
    quoteLine1: card?.quoteLine1 ?? "放手不是输。",
    quoteLine2: card?.quoteLine2 ?? "省下的筹码，是下一手的底气。",
  };
}

function selectPokerLegend(seed: number): PokerLegendMatch {
  const legends = pokerLegendsData as LegendEntry[];
  const entry = legends[seededIndex(seed + 50, legends.length)];
  const reason =
    entry.reasons[seededIndex(seed + 51, entry.reasons.length)] ??
    entry.reasons[0];
  const percent = 72 + seededIndex(seed + 52, 17);

  return {
    name: entry.name,
    nameZh: entry.nameZh,
    percent,
    reason,
  };
}

function buildDestinySignals(seed: number): DestinySignals {
  const d = destinyData;
  const numberPool = d.luckyNumbers as LuckyNumberPick[];
  const numberCount = Math.min(seededIndex(seed + 1, 3) + 1, numberPool.length);
  const luckyNumbers = pickUniqueNumbers(numberPool, numberCount, seed + 2);

  const direction =
    d.directions[seededIndex(seed + 10, d.directions.length)];
  const timeSlot = d.times[seededIndex(seed + 11, d.times.length)];
  const color = d.colors[seededIndex(seed + 12, d.colors.length)];
  const omen = d.tableOmens[seededIndex(seed + 13, d.tableOmens.length)];

  const luckyPool = handsData.lucky as HandPick[];
  const dangerPool = handsData.dangerous as HandPick[];

  return {
    luckyNumbers,
    luckyDirection: direction.name,
    directionExplanation: direction.explanation,
    luckyTime: timeSlot.range,
    timeExplanation: timeSlot.explanation,
    luckyColor: color.name,
    colorNote: color.note,
    tableOmen: {
      name: omen.name,
      meaning: omen.meaning,
      warning: omen.warning,
    },
    luckyHands: pickUniqueHandPicks(luckyPool, 3, seed + 20),
    dangerHands: pickUniqueHandPicks(dangerPool, 3, seed + 21),
  };
}

function isInZodiacRange(month: number, day: number, z: ZodiacEntry): boolean {
  const cur = month * 100 + day;
  const start = z.monthStart * 100 + z.dayStart;
  const end = z.monthEnd * 100 + z.dayEnd;
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end;
}

function getZodiacFromBirthday(birthday: string): ZodiacEntry | null {
  const parts = birthday.split("-");
  if (parts.length < 3) return null;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(month) || Number.isNaN(day)) return null;

  for (const z of zodiacData as ZodiacEntry[]) {
    if (isInZodiacRange(month, day, z)) return z;
  }
  return null;
}

function selectZodiac(input: FortuneInput, seed: number): ZodiacProfile {
  const signs = zodiacData as ZodiacEntry[];
  const fromBirthday = input.birthday
    ? getZodiacFromBirthday(input.birthday)
    : null;
  const entry = fromBirthday ?? signs[seededIndex(seed + 30, signs.length)];
  return { signEn: entry.signEn, signZh: entry.signZh };
}

function resolveMbti(input: FortuneInput): MbtiProfile {
  const profiles = mbtiData as MbtiProfile[];
  return profiles.find((p) => p.type === input.mbti) ?? profiles[0];
}

function buildPersonalityLayer(
  seed: number,
  mbti: MbtiProfile,
  zodiac: ZodiacProfile
): PersonalityLayer {
  const templates = personalityExplanations as string[];
  const template = templates[seededIndex(seed + 35, templates.length)];
  const explanation = template
    .replace(/\{mbti\}/g, mbti.type)
    .replace(/\{zodiac\}/g, zodiac.signZh);

  return { mbti, mbtiFromUser: true, zodiac, explanation };
}

function buildFortuneFromSeed(input: FortuneInput, seed: number): FortuneResult {
  const soulType = selectSoulType(seed);
  const dailyKey = buildDailyKey(input);
  const mbti = resolveMbti(input);
  const zodiac = selectZodiac(input, seed);
  const tableEnergyIndex = calculateTableEnergyIndex(input, seed, zodiac);

  return {
    dailyKey,
    nickname: input.nickname.trim(),
    gameType: input.gameType,
    tableEnergyIndex,
    soulType,
    todayAdvice: soulType.today,
    pokerMirror: getPokerMirror(soulType.id),
    sessionEnergy: selectSessionEnergy(input, tableEnergyIndex.score),
    destiny: buildDestinySignals(seed),
    personality: buildPersonalityLayer(seed, mbti, zodiac),
    todayRival: getTableRelation(soulType.id, "rivals"),
    todayAlly: getTableRelation(soulType.id, "allies"),
    fortuneCard: selectFortuneCard(soulType.id, seed, input),
    pokerLegend: selectPokerLegend(seed),
  };
}

export const FORTUNE_STORAGE_KEY = "poker-soul-fortune-v9";
export const FORTUNE_DAILY_PREFIX = "poker-soul-daily-v9-";

function isValidFortuneResult(data: unknown): data is FortuneResult {
  if (!data || typeof data !== "object") return false;
  const r = data as FortuneResult;
  return (
    typeof r.dailyKey === "string" &&
    typeof r.nickname === "string" &&
    r.tableEnergyIndex != null &&
    typeof r.tableEnergyIndex.score === "number" &&
    typeof r.soulType?.id === "string" &&
    typeof r.soulType?.fateTitle === "string"
  );
}

export function generateFortune(input: FortuneInput): FortuneResult {
  const dailyKey = buildDailyKey(input);
  const cacheKey = `${FORTUNE_DAILY_PREFIX}${dailyKey}`;

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as FortuneResult;
        if (parsed.dailyKey === dailyKey && isValidFortuneResult(parsed)) {
          saveFortuneResult(parsed);
          return parsed;
        }
        localStorage.removeItem(cacheKey);
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  const seed = buildDailySeed(input);
  const result = buildFortuneFromSeed(input, seed);
  saveFortuneResult(result);
  return result;
}

export function saveFortuneResult(result: FortuneResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(result));
  localStorage.setItem(
    `${FORTUNE_DAILY_PREFIX}${result.dailyKey}`,
    JSON.stringify(result)
  );
}

export function loadFortuneResult(): FortuneResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(FORTUNE_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FortuneResult;
    if (!isValidFortuneResult(parsed)) {
      sessionStorage.removeItem(FORTUNE_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(FORTUNE_STORAGE_KEY);
    return null;
  }
}

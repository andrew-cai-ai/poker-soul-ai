export type Mood =
  | "confident"
  | "anxious"
  | "calm"
  | "revenge"
  | "lucky"
  | "tilted";

export type RecentResult =
  | "big_win"
  | "small_win"
  | "break_even"
  | "small_loss"
  | "bad_beat"
  | "on_fire";

export type GameType =
  | "texas_holdem"
  | "omaha"
  | "short_deck"
  | "tournament"
  | "cash_game"
  | "home_game";

export type MbtiType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export interface FortuneInput {
  nickname: string;
  birthday?: string;
  mbti: MbtiType;
  mood: Mood;
  recentResult: RecentResult;
  gameType: GameType;
}

export interface SoulType {
  id: string;
  symbol: string;
  nameEn: string;
  nameZh: string;
  fateTitle: string;
  keywords: string[];
  selfIdentity: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  playingTendency: string;
  today: string;
  warningPool: string[];
}

export interface PokerMirror {
  see: string;
  inside: string;
  gap: string;
}

export interface SessionEnergy {
  id: string;
  name: string;
  description: string;
  danger: string;
}

export interface LuckyNumberPick {
  value: number;
  meaning: string;
}

export interface TableOmen {
  name: string;
  meaning: string;
  warning: string;
}

export interface DestinySignals {
  luckyNumbers: LuckyNumberPick[];
  luckyDirection: string;
  directionExplanation: string;
  luckyTime: string;
  timeExplanation: string;
  luckyColor: string;
  colorNote: string;
  tableOmen: TableOmen;
  luckyHands: string[];
  dangerHands: string[];
}

export interface HandPick {
  hand: string;
  reason: string;
}

export interface MbtiProfile {
  type: string;
  pokerTendency: string;
}

export interface ZodiacProfile {
  signEn: string;
  signZh: string;
}

export interface PersonalityLayer {
  mbti: MbtiProfile;
  mbtiFromUser: boolean;
  zodiac: ZodiacProfile;
  explanation: string;
}

export interface FortuneCard {
  id: string;
  nameZh: string;
  quoteLine1: string;
  quoteLine2: string;
}

export interface TableRelation {
  emoji: string;
  nameZh: string;
  nameEn: string;
  reason: string;
  warning?: string;
}

export interface PokerLegendMatch {
  name: string;
  nameZh: string;
  percent: number;
  reason: string;
}

export interface TableEnergyIndex {
  score: number;
  emoji: string;
  label: string;
  explanation: string;
}

export interface FortuneResult {
  dailyKey: string;
  nickname: string;
  gameType: GameType;
  tableEnergyIndex: TableEnergyIndex;
  soulType: SoulType;
  todayAdvice: string;
  pokerMirror: PokerMirror;
  sessionEnergy: SessionEnergy;
  destiny: DestinySignals;
  personality: PersonalityLayer;
  todayRival: TableRelation;
  todayAlly: TableRelation;
  fortuneCard: FortuneCard;
  pokerLegend: PokerLegendMatch;
}

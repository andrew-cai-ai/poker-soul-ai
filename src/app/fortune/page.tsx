"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { getGenerationMeta, trackDestinyGenerated } from "@/lib/analytics";
import { generateFortune } from "@/lib/fortune-engine";
import type {
  FortuneInput,
  GameType,
  MbtiType,
  Mood,
  RecentResult,
} from "@/types/fortune";

const MBTI_TYPES: MbtiType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "confident", label: "自信", emoji: "😎" },
  { value: "calm", label: "冷静", emoji: "😌" },
  { value: "lucky", label: "手感好", emoji: "🍀" },
  { value: "anxious", label: "有点虚", emoji: "😰" },
  { value: "revenge", label: "想复仇", emoji: "😤" },
  { value: "tilted", label: "上头中", emoji: "🔥" },
];

const RECENT_RESULTS: { value: RecentResult; label: string }[] = [
  { value: "on_fire", label: "手感火热" },
  { value: "big_win", label: "大胜" },
  { value: "small_win", label: "小赢" },
  { value: "break_even", label: "持平" },
  { value: "small_loss", label: "小输" },
  { value: "bad_beat", label: "被爆冷" },
];

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: "texas_holdem", label: "德州扑克" },
  { value: "omaha", label: "奥马哈" },
  { value: "short_deck", label: "短牌" },
  { value: "tournament", label: "锦标赛" },
  { value: "cash_game", label: "现金局" },
  { value: "home_game", label: "家庭局" },
];

export default function FortuneFormPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mbti, setMbti] = useState<MbtiType | "">("");
  const [mood, setMood] = useState<Mood>("confident");
  const [recentResult, setRecentResult] = useState<RecentResult>("break_even");
  const [gameType, setGameType] = useState<GameType>("texas_holdem");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("填个昵称，报告里好称呼你。");
      return;
    }
    if (trimmed.length > 24) {
      setError("昵称不能超过 24 个字符。");
      return;
    }
    if (!mbti) {
      setError("请选择你的 MBTI 类型。");
      return;
    }

    const input: FortuneInput = {
      nickname: trimmed,
      birthday: birthday || undefined,
      mbti,
      mood,
      recentResult,
      gameType,
    };

    try {
      const meta = getGenerationMeta();
      const result = generateFortune(input);
      trackDestinyGenerated(input, result, meta);
      router.push("/result");
    } catch {
      setError("生成失败，请刷新页面后重试。");
    }
  }

  return (
    <Layout showBack>
      <section>
        <h1 className="font-display text-2xl font-bold text-casino-gold">
          输入你的牌桌状态
        </h1>
        <p className="mt-2 text-gray-400">
          同一昵称+生日+当天，结果固定。自选 MBTI，选填生日定星座。
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="nickname" className="label-mystic">
              昵称 *
            </label>
            <input
              id="nickname"
              type="text"
              className="input-mystic"
              placeholder="例如：河牌杀手"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              maxLength={24}
              autoComplete="nickname"
            />
          </div>

          <div>
            <span className="label-mystic">MBTI *</span>
            <p className="mb-2 text-xs text-gray-500">选择你的人格类型</p>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMbti(type);
                    setError("");
                  }}
                  className={`select-chip font-mono text-xs ${mbti === type ? "select-chip-active" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="birthday" className="label-mystic">
              生日（选填 → 星座）
            </label>
            <input
              id="birthday"
              type="date"
              className="input-mystic"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div>
            <span className="label-mystic">当前状态</span>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`select-chip ${mood === m.value ? "select-chip-active" : ""}`}
                >
                  <span className="mr-1">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label-mystic">最近战绩</span>
            <div className="grid grid-cols-2 gap-2">
              {RECENT_RESULTS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRecentResult(r.value)}
                  className={`select-chip ${recentResult === r.value ? "select-chip-active" : ""}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label-mystic">常玩游戏</span>
            <div className="grid grid-cols-2 gap-2">
              {GAME_TYPES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGameType(g.value)}
                  className={`select-chip ${gameType === g.value ? "select-chip-active" : ""}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-casino-crimson">{error}</p>
          )}

          <button type="submit" className="btn-gold w-full">
            生成牌风报告
          </button>
        </form>
      </section>
    </Layout>
  );
}

import Link from "next/link";
import { HomeTracker } from "@/components/HomeTracker";
import { Layout } from "@/components/Layout";
import { PlayingCardDecor } from "@/components/PlayingCardDecor";

export default function LandingPage() {
  return (
    <Layout>
      <HomeTracker />
      <section className="relative flex flex-1 flex-col items-center justify-center text-center">
        <PlayingCardDecor className="-left-2 top-8 rotate-[-15deg]" />
        <PlayingCardDecor className="-right-2 top-24 rotate-[15deg]" />

        <div className="mb-6 text-5xl">🃏</div>

        <h1 className="font-display text-3xl font-bold leading-tight text-casino-gold sm:text-4xl">
          Poker Soul AI
        </h1>
        <p className="mt-2 text-sm tracking-wider text-casino-gold/60">
          扑克 · MBTI · 星座 · 运势
        </p>

        <p className="mt-8 max-w-xs font-body text-lg leading-relaxed text-gray-300">
          70% 真实牌桌语言，30% 运势仪式感。牌风、镜像、本场状态——测完就想发给牌友。
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          <Link href="/fortune" className="btn-gold">
            生成我的牌风报告
          </Link>
          <p className="text-xs text-gray-500">
            免费 · 无需注册 · 可分享结果
          </p>
        </div>

        <div className="mt-12 grid w-full grid-cols-2 gap-3">
          {[
            { icon: "♠", label: "牌魂类型", sub: "TAG / LAG / 河杀" },
            { icon: "📊", label: "运势层", sub: "手牌 · 时段 · 方位" },
            { icon: "🧠", label: "MBTI", sub: "扑克倾向" },
            { icon: "♈", label: "星座", sub: "今日节奏" },
          ].map((item) => (
            <div key={item.label} className="card-mystic p-3 text-left">
              <div className="text-2xl">{item.icon}</div>
              <div className="mt-1 font-display text-xs font-semibold text-casino-gold/90">
                {item.label}
              </div>
              <div className="text-[10px] text-gray-500">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

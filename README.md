# Poker Soul AI

**中文** · 扑克牌风报告 Web App：**扑克 + 人格 + 运势仪式感 + 社交分享**  
**EN** · Poker personality report web app: **Poker + Personality + Ritual + Social sharing**

**中文** · 定位：70% 真实牌桌语言 + 30% 玄学娱乐感。不是塔罗、不是 GTO 教学、不是牌技教练。  
**EN** · Positioning: 70% real table language, 30% mystical entertainment. Not tarot, not GTO coaching, not a poker trainer.

---

## 技术栈 · Tech stack

| 中文 | EN |
|------|-----|
| Next.js 15 (App Router) | Next.js 15 (App Router) |
| TypeScript + Tailwind CSS | TypeScript + Tailwind CSS |
| 本地规则引擎 + JSON（无数据库） | Local rule engine + JSON (no database) |
| PostHog 埋点（可选） | PostHog analytics (optional) |
| 静态角色立绘 `public/characters/` | Static character art in `public/characters/` |

---

## 页面 · Routes

| 路由 Route | 中文 | EN |
|------------|------|-----|
| `/` | 首页 | Landing |
| `/fortune` | 表单：昵称、MBTI、生日、心情、战绩、游戏类型 | Form: nickname, MBTI, birthday, mood, results, game type |
| `/result` | 完整报告 + 分享图 / 文案 | Full report + share image / copy |

---

## 结果页模块 · Result page (top → bottom)

| # | 中文 | EN |
|---|------|-----|
| 1 | 玩家昵称 | Player nickname |
| 2 | 今日桌面能量（0–100，五档状态） | Table energy index (0–100, five tiers) |
| 3 | 牌魂类型（8 archetypes + 立绘） | Poker soul type + character portrait |
| 4 | 牌桌镜像（看到的 / 脑子里的 / 缝隙） | Table mirror (seen / inside / gap) |
| 5 | 本场状态（由战绩与心情推导） | Session energy (from recent results + mood) |
| 6 | 运势信号（数字、时段、方位、配色、征兆） | Destiny signals |
| 7 | 手牌信号（幸运 / 避开） | Lucky & danger hands |
| 8 | MBTI + 星座（张力叙事，无 GTO/EV） | MBTI + zodiac tension narrative |
| 9 | 今日宿敌 & 盟友 | Today’s nemesis & ally |
| 10 | 今日牌语 + 今日像谁 | Fortune card + pro match |
| 11 | 分享图 / 分享按钮 | Share image & platform buttons |

**中文** · 界面不显示 TAG、LAG 等英文标签（仅内部映射）。  
**EN** · UI never shows TAG/LAG labels to users (internal mapping only).

---

## 八种牌魂 · Eight soul archetypes

| 中文名 | EN-style id | 立绘文件 Asset |
|--------|-------------|----------------|
| 冷面收割者 | `cold_reaper` | `cold-harvester.png` |
| 疯狗压迫者 | `mad_dog` | `mad-dog.png` |
| 乌龟守门员 | `turtle_keeper` | `turtle-guardian.png` |
| 河牌猎人 | `river_hunter` | `river-hunter.png` |
| 狐狸设局师 | `fox_schemer` | `fox-trickster.png` |
| 上头修罗 | `tilt_asura` | `tilt-asura.png` |
| 翻牌炼金师 | `flop_alchemist` | `flop-alchemist.png` |
| 沉默读心者 | `silent_reader` | `mind-reader.png` |

**中文** · 映射见 `src/lib/character-images.ts`；缺图时回退花色头像。  
**EN** · See `src/lib/character-images.ts`; missing files fall back to suit-symbol avatar.

---

## 每日种子 · Daily seed

```
seed = hash(nickname + birthday + YYYY-MM-DD)
```

| 中文 | EN |
|------|-----|
| 同一人同一天结果固定 | Same person + same day → same result |
| 刷新页面不换命 | Refresh does not change destiny |
| 缓存 v9：`localStorage` + `sessionStorage` | Cache v9 in browser storage |

---

## 本地运行 · Local development

```bash
cd poker-soul-ai
npm install
cp .env.example .env.local   # 可选 optional: PostHog
npm run dev
```

**中文** · 打开终端 **Local** 地址（默认 `http://localhost:3000`）。  
**EN** · Open the **Local** URL from the terminal (default `http://localhost:3000`).

### 常用脚本 · Scripts

| 命令 Command | 中文 | EN |
|--------------|------|-----|
| `npm run dev` | 开发，`0.0.0.0`，打印局域网 URL | Dev on `0.0.0.0`, prints LAN URL |
| `npm run dev:clean` | 杀旧进程、删 `.next` 后重启 | Kill stale process, clear `.next`, restart |
| `npm run build` | 生产构建 | Production build |
| `npm run start` | 生产模式本地预览 | Production server locally |
| `npm run start:clean` | 清缓存 → 构建 → 启动 | Clean → build → start |

```bash
npm run dev -- --hostname 0.0.0.0
```

### 手机真机调试 · Mobile testing

1. **中文** · 手机与电脑同一 WiFi · **EN** · Phone and computer on the same Wi‑Fi  
2. **中文** · 运行 `npm run dev`，看终端 **Network** · **EN** · Run `npm run dev`, note **Network** line  
3. **中文** · 手机打开 · **EN** · On phone open:

   `http://[local-ip]:3000/fortune`

**中文** · 打不开：检查防火墙 / 运行 `npm run dev:clean`  
**EN** · Can’t connect: check firewall / run `npm run dev:clean`

```
Local:   http://localhost:3000
Network: http://192.168.1.42:3000
```

### 常见问题 · Troubleshooting

**`Cannot find module './xxx.js'`**

```bash
kill -9 $(lsof -ti :3000) 2>/dev/null
rm -rf .next
npm run dev:clean
```

**中文** · `.next` 缓存损坏时出现。  
**EN** · Corrupted `.next` build cache.

---

## 环境变量 · Environment variables

```bash
# .env.local (see .env.example)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**中文** · 未配置 PostHog 时埋点静默跳过。  
**EN** · Without PostHog keys, analytics are no-ops.

---

## 项目结构 · Project structure

```
src/
  app/              # pages · 页面
  components/       # UI
  data/             # JSON content · 文案数据
  lib/              # engine, analytics, share-image
public/characters/  # 8 character PNGs · 角色立绘
scripts/            # dev-network.sh, dev-clean.sh
```

---

## 部署 · Deploy

**中文** · 推送到 GitHub，导入 Vercel，`npm run build`。  
**EN** · Push to GitHub, import on Vercel, build with `npm run build`.

---

## 作者 · Author

**Built by Andrew Cai** — AI × Poker × Personality

- GitHub: https://github.com/andrew-cai-ai
- LinkedIn: https://www.linkedin.com/in/andrew-cai-666b4b171/

---

## 免责声明 · Disclaimer

**中文** · 仅供娱乐，请理性游戏。  
**EN** · For entertainment only. Play responsibly.

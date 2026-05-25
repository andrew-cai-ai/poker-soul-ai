# Poker Soul AI

扑克牌风报告 Web App：**扑克 + MBTI + 星座 + 运势 + 社交分享**

不是塔罗占卜，而是牌友能看懂的语言：TAG、LAG、位置、压力、纪律、读牌。

## 技术栈

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- 本地规则引擎 + JSON 数据（无数据库）

## 页面

| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/fortune` | 输入表单 |
| `/result` | 四层报告 + 分享 |

## 结果页结构

1. **Poker Soul Type** — 7 种牌风（TAG / LAG / Nit / 跟注站 / 狐狸 / 河杀 / 修罗）
2. **Destiny Layer** — 幸运数字、方位、时段、配色、手牌
3. **MBTI + Zodiac** — 性格与扑克倾向、星座、今日解读
4. **Fortune Card** — 翻前/翻牌/转牌/河牌等牌语

## 本地运行

```bash
cd poker-soul-ai
npm install
npm run dev
```

打开 http://localhost:3000

## 部署

推送到 GitHub 后导入 Vercel 即可。

```bash
npm run build
```

## 免责声明

仅供娱乐，请理性游戏。

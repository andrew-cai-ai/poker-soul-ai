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

开发服务器绑定 `0.0.0.0`，终端会打印本机与局域网地址。

等价命令：

```bash
npm run dev -- --hostname 0.0.0.0
```

### Mobile testing

- 手机和电脑连接**同一 WiFi**
- 终端里找到 **Network** 一行（例如 `http://192.168.1.xxx:3000`）
- 在手机浏览器打开：

  `http://[local-ip]:3000/fortune`

- 若无法访问：检查 Mac 防火墙是否允许 Node，或换 `npm run dev:clean` 重启

示例：

```
Local:   http://localhost:3000
Network: http://192.168.1.42:3000
```

## 部署

推送到 GitHub 后导入 Vercel 即可。

```bash
npm run build
```

## 免责声明

仅供娱乐，请理性游戏。

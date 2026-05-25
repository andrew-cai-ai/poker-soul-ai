import type { FortuneResult } from "@/types/fortune";

const W = 390;
const H = 720;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split("");
  let line = "";
  let cy = y;

  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, cy);
      line = chars[i];
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cy);
    cy += lineHeight;
  }
  return cy;
}

export async function generateShareImageBlob(
  result: FortuneResult
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0a0f");
  bg.addColorStop(1, "#1a1028");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(212,175,55,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  let y = 56;
  const pad = 32;
  const maxW = W - pad * 2;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 22px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Poker Soul AI", W / 2, y);
  y += 36;

  ctx.fillStyle = "#f0d78c";
  ctx.font = "bold 26px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText(result.nickname, W / 2, y);
  y += 40;

  ctx.textAlign = "left";
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("今日桌面能量", pad, y);
  y += 24;
  ctx.fillStyle = "#f0d78c";
  ctx.font = "bold 22px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(
    ctx,
    `${result.tableEnergyIndex.score} / 100 · ${result.tableEnergyIndex.emoji} ${result.tableEnergyIndex.label}`,
    pad,
    y,
    maxW,
    28
  );
  y += 12;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("牌魂类型", pad, y);
  y += 24;
  ctx.fillStyle = "#e8e8e8";
  ctx.font = "18px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(
    ctx,
    `${result.soulType.nameZh} · ${result.soulType.fateTitle}`,
    pad,
    y,
    maxW,
    26
  );
  y += 12;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("本场状态", pad, y);
  y += 24;
  ctx.fillStyle = "#cccccc";
  ctx.font = "16px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(ctx, result.sessionEnergy.name, pad, y, maxW, 24);
  y += 12;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText(`${result.todayRival.emoji} 今日宿敌`, pad, y);
  y += 24;
  ctx.fillStyle = "#cccccc";
  ctx.font = "15px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(ctx, result.todayRival.nameZh, pad, y, maxW, 22);
  y = wrapText(ctx, result.todayRival.reason, pad, y, maxW, 22);
  y += 8;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText(`🤝 今日盟友`, pad, y);
  y += 24;
  ctx.fillStyle = "#cccccc";
  ctx.font = "15px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(ctx, result.todayAlly.nameZh, pad, y, maxW, 22);
  y = wrapText(ctx, result.todayAlly.reason, pad, y, maxW, 22);
  y += 8;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("今日牌语", pad, y);
  y += 24;
  ctx.fillStyle = "#e8e8e8";
  ctx.font = "italic 15px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(ctx, `「${result.fortuneCard.quoteLine1}」`, pad, y, maxW, 22);
  y = wrapText(ctx, `「${result.fortuneCard.quoteLine2}」`, pad, y, maxW, 22);
  y += 8;

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 16px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("今日像谁", pad, y);
  y += 24;
  ctx.fillStyle = "#f0d78c";
  ctx.font = "bold 17px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(
    ctx,
    `${result.pokerLegend.nameZh}（${result.pokerLegend.percent}%）`,
    pad,
    y,
    maxW,
    24
  );
  ctx.fillStyle = "#cccccc";
  ctx.font = "15px PingFang SC, Microsoft YaHei, sans-serif";
  y = wrapText(ctx, result.pokerLegend.reason, pad, y, maxW, 22);

  ctx.fillStyle = "rgba(150,150,150,0.8)";
  ctx.font = "12px PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("#PokerSoulAI · 扑克牌风", W / 2, H - 28);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function downloadShareImage(blob: Blob, nickname: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `poker-soul-${nickname}-${todayDateString()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

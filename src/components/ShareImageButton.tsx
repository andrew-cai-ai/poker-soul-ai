"use client";

import { useState } from "react";
import type { FortuneResult } from "@/types/fortune";
import { trackShareCardGenerated } from "@/lib/analytics";
import { downloadShareImage, generateShareImageBlob } from "@/lib/share-image";

interface ShareImageButtonProps {
  result: FortuneResult;
}

export function ShareImageButton({ result }: ShareImageButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setDone(false);
    try {
      const blob = await generateShareImageBlob(result);
      if (blob) {
        downloadShareImage(blob, result.nickname);
        trackShareCardGenerated(result);
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="btn-outline w-full"
    >
      {loading ? "生成中…" : done ? "✓ 已保存分享图" : "生成分享图"}
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { trackAppOpened } from "@/lib/analytics";

export function HomeTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackAppOpened();
  }, []);

  return null;
}

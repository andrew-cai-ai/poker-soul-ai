"use client";

import { useEffect, useRef } from "react";
import { trackProMatchViewed } from "@/lib/analytics";

interface ProMatchTrackerProps {
  proPlayer: string;
}

export function ProMatchTracker({ proPlayer }: ProMatchTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackProMatchViewed(proPlayer);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [proPlayer]);

  return <div ref={ref} className="contents" />;
}

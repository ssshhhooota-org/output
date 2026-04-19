import { useState, useEffect } from "react";
import type { TocHeading } from "@/lib/posts";

const HEADER_OFFSET = 80;

export function useActiveHeading(headings: TocHeading[]): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    function getActiveHeading() {
      let current = "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 4) {
          // +4px tolerance for sub-pixel rendering
          current = heading.id;
        }
      }
      return current;
    }

    function onScroll() {
      setActiveId(getActiveHeading());
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  return activeId;
}

"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -75% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24">
        <div className="border-l-2 border-[var(--accent)] pl-4">
          <p className="mb-2 text-xs font-semibold text-[var(--accent)]">
            目次
          </p>
          <ul className="flex flex-col gap-1.5 text-sm">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                <a
                  href={`#${h.id}`}
                  className={`block transition-colors ${
                    activeId === h.id
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--sub)] hover:text-[var(--fg)]"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export function InlineTableOfContents({
  headings,
}: {
  headings: TocHeading[];
}) {
  if (headings.length === 0) return null;

  return (
    <nav className="mt-4 lg:hidden">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--accent-surface)] p-4">
        <p className="mb-2 text-xs font-semibold text-[var(--accent)]">目次</p>
        <ul className="flex flex-col gap-1 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
              <a
                href={`#${h.id}`}
                className="text-[var(--sub)] hover:text-[var(--fg)] transition-colors"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

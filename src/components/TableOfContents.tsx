"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const HEADER_OFFSET = 80;

    function getActiveHeading() {
      let current = "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= HEADER_OFFSET + 4) {
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

  if (headings.length === 0) return null;

  function handleClick(id: string) {
    setActiveId(id);
  }

  return (
    <nav className="hidden lg:block w-48 shrink-0">
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
                  onClick={() => handleClick(h.id)}
                  className={`block cursor-pointer transition-colors ${
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

export function MobileTocButton({
  headings,
}: {
  headings: TocHeading[];
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const HEADER_OFFSET = 80;

    function getActiveHeading() {
      let current = "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= HEADER_OFFSET + 4) {
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

  if (headings.length === 0) return null;

  return (
    <>
      {/* Floating hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="目次を開く"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="12" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed bottom-0 right-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--bg)] p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--accent)]">目次</p>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--sub)] hover:bg-[var(--border)]"
            aria-label="目次を閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className={`block py-1 cursor-pointer transition-colors ${
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
      </nav>
    </>
  );
}

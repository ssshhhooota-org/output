"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { TocHeading } from "@/lib/posts";

type NoteItem = {
  slug: string;
  title: string;
};

type Props = {
  currentPage: string;
  currentSlug: string;
  notes: NoteItem[];
  headings: TocHeading[];
  children: React.ReactNode;
};

export function NoteLayout({
  currentPage,
  currentSlug,
  notes,
  headings,
  children,
}: Props) {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;
    const HEADER_OFFSET = 80;

    function getActiveHeading() {
      let current = "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 4) {
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

  function handleTocClick(id: string) {
    setActiveId(id);
    setTocOpen(false);
  }

  const pageList = (
    <div className="border-l-2 border-[var(--accent-light)] pl-4">
      <p className="mb-2 text-xs font-semibold text-[var(--accent)]">
        {currentPage.replace(/_/g, " ")}
      </p>
      <ul className="flex flex-col gap-1.5 text-sm">
        {notes.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/note/${currentPage}/${n.slug}`}
              onClick={() => setPagesOpen(false)}
              className={`block transition-colors ${
                n.slug === currentSlug
                  ? "text-[var(--accent)] font-medium"
                  : "text-[var(--sub)] hover:text-[var(--fg)]"
              }`}
            >
              {n.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 lg:px-8">
      {/* 3-column desktop layout */}
      <div className="flex gap-8">
        {/* Left sidebar - file list (desktop) */}
        <nav className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24">{pageList}</div>
        </nav>

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>

        {/* Right sidebar - TOC (desktop) */}
        {headings.length > 0 && (
          <nav className="hidden lg:block w-56 shrink-0">
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
                        onClick={() => handleTocClick(h.id)}
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
        )}
      </div>

      {/* Mobile: Pages floating button (top-left) */}
      <button
        onClick={() => setPagesOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="ページ一覧を開く"
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
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
        </svg>
      </button>

      {/* Mobile: TOC floating button (bottom-right, same as blog) */}
      {headings.length > 0 && (
        <button
          onClick={() => setTocOpen(true)}
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
      )}

      {/* Pages drawer (mobile, from bottom) */}
      {pagesOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setPagesOpen(false)}
        />
      )}
      <nav
        className={`fixed bottom-0 left-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--bg)] p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          pagesOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--accent)]">
            {currentPage.replace(/_/g, " ")}
          </p>
          <button
            onClick={() => setPagesOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--sub)] hover:bg-[var(--border)]"
            aria-label="ページ一覧を閉じる"
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
          {notes.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/note/${currentPage}/${n.slug}`}
                onClick={() => setPagesOpen(false)}
                className={`block py-1 cursor-pointer transition-colors ${
                  n.slug === currentSlug
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--sub)] hover:text-[var(--fg)]"
                }`}
              >
                {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* TOC drawer (mobile, from bottom, same as blog) */}
      {tocOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setTocOpen(false)}
        />
      )}
      {headings.length > 0 && (
        <nav
          className={`fixed bottom-0 right-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--bg)] p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
            tocOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--accent)]">目次</p>
            <button
              onClick={() => setTocOpen(false)}
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
                  onClick={() => handleTocClick(h.id)}
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
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import type { TocHeading } from "@/lib/posts";
import { TocSidebar, TocDrawer } from "@/components/TableOfContents";
import { Drawer } from "@/components/ui/Drawer";
import { FloatingButton } from "@/components/ui/FloatingButton";

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
  const pageTitle = currentPage.replace(/_/g, " ");

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 lg:px-8">
      <div className="flex gap-8">
        {/* Left sidebar - page list (desktop) */}
        <nav aria-label={pageTitle} className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24">
            <p className="mb-3 text-xs font-semibold text-[var(--accent)] tracking-wide uppercase">
              {pageTitle}
            </p>
            <ul className="flex flex-col gap-1 text-sm">
              {notes.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/note/${currentPage}/${n.slug}`}
                    className={`block rounded-lg px-3 py-2 transition-all ${
                      n.slug === currentSlug
                        ? "bg-[var(--accent-surface)] text-[var(--accent)] font-medium border border-[var(--accent)]/20"
                        : "text-[var(--sub)] hover:bg-[var(--accent-surface)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>

        {/* Right sidebar - TOC (desktop) */}
        <TocSidebar headings={headings} />
      </div>

      {/* Mobile: pages floating button */}
      <FloatingButton
        onClick={() => setPagesOpen(true)}
        aria-label="ページ一覧を開く"
        position="bottom-left"
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
      </FloatingButton>

      {/* Mobile: TOC floating button + drawer */}
      <TocDrawer headings={headings} />

      {/* Mobile: pages drawer */}
      <Drawer
        open={pagesOpen}
        onClose={() => setPagesOpen(false)}
        title={pageTitle}
      >
        <ul className="flex flex-col gap-2 text-sm">
          {notes.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/note/${currentPage}/${n.slug}`}
                onClick={() => setPagesOpen(false)}
                className={`block cursor-pointer py-1 transition-colors ${
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
      </Drawer>
    </div>
  );
}

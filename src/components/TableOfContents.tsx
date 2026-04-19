"use client";

import { useState } from "react";
import type { TocHeading } from "@/lib/posts";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import { Drawer } from "@/components/ui/Drawer";
import { FloatingButton } from "@/components/ui/FloatingButton";

function TocList({
  headings,
  activeId,
  onItemClick,
}: {
  headings: TocHeading[];
  activeId: string;
  onItemClick?: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
          <a
            href={`#${h.id}`}
            onClick={() => onItemClick?.(h.id)}
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
  );
}

export function TocSidebar({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="目次" className="hidden lg:block w-48 shrink-0">
      <div className="sticky top-24">
        <div className="border-l-2 border-[var(--accent)] pl-4">
          <p className="mb-2 text-xs font-semibold text-[var(--accent)]">
            目次
          </p>
          <TocList headings={headings} activeId={activeId} />
        </div>
      </div>
    </nav>
  );
}

export function TocDrawer({ headings }: { headings: TocHeading[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <>
      <FloatingButton
        onClick={() => setOpen(true)}
        aria-label="目次を開く"
        position="bottom-right"
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
      </FloatingButton>
      <Drawer open={open} onClose={() => setOpen(false)} title="目次">
        <TocList
          headings={headings}
          activeId={activeId}
          onItemClick={() => setOpen(false)}
        />
      </Drawer>
    </>
  );
}

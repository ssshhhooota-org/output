# TOC コンポーネントリファクタリング 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** スクロール検出ロジック・ドロワーUI・FABボタンの重複を排除し、Hook / UI Primitives / 機能コンポーネントの3層構造に整理する

**Architecture:** `useActiveHeading` hookでスクロール検出を集約し、`Drawer`/`FloatingButton` UIプリミティブを `src/components/ui/` に配置する。`TableOfContents.tsx` は `TocSidebar`/`TocDrawer` にリネームし、`NoteLayout.tsx` はそれらを再利用する。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4

---

## ファイル構成

| ファイル                               | 変更 | 責務                                                           |
| -------------------------------------- | ---- | -------------------------------------------------------------- |
| `src/hooks/useActiveHeading.ts`        | 新規 | スクロール位置からアクティブ見出しIDを返すhook                 |
| `src/components/ui/FloatingButton.tsx` | 新規 | 画面固定の丸いFABボタン                                        |
| `src/components/ui/Drawer.tsx`         | 新規 | ボトムシートドロワー（backdrop + パネル + 閉じるボタン）       |
| `src/components/TableOfContents.tsx`   | 変更 | `TocSidebar` + `TocDrawer` にリファクタ（内部 `TocList` 共有） |
| `src/app/blog/[slug]/page.tsx`         | 変更 | import名を `TocSidebar`/`TocDrawer` に更新                     |
| `src/components/NoteLayout.tsx`        | 変更 | インラインTOCを削除し `TocSidebar`/`TocDrawer` を使用          |

---

## Task 1: `useActiveHeading` hookを作成

**Files:**

- Create: `src/hooks/useActiveHeading.ts`

- [ ] **Step 1: ファイルを作成**

```ts
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
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

エラーなしを確認。

- [ ] **Step 3: コミット**

```bash
git add src/hooks/useActiveHeading.ts
git commit -m "feat: useActiveHeadingフックを追加"
```

---

## Task 2: `FloatingButton` プリミティブを作成

**Files:**

- Create: `src/components/ui/FloatingButton.tsx`

- [ ] **Step 1: `src/components/ui/` ディレクトリを作成してファイルを書く**

```tsx
"use client";

type FloatingButtonProps = {
  onClick: () => void;
  "aria-label": string;
  position: "bottom-left" | "bottom-right";
  children: React.ReactNode;
};

export function FloatingButton({
  onClick,
  "aria-label": ariaLabel,
  position,
  children,
}: FloatingButtonProps) {
  const positionClass = position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`fixed ${positionClass} z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add src/components/ui/FloatingButton.tsx
git commit -m "feat: FloatingButtonプリミティブを追加"
```

---

## Task 3: `Drawer` プリミティブを作成

**Files:**

- Create: `src/components/ui/Drawer.tsx`

- [ ] **Step 1: ファイルを作成**

```tsx
"use client";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <nav
        className={`fixed bottom-0 left-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--bg)] p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--accent)]">{title}</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--sub)] hover:bg-[var(--border)]"
            aria-label={`${title}を閉じる`}
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
        {children}
      </nav>
    </>
  );
}
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add src/components/ui/Drawer.tsx
git commit -m "feat: Drawerプリミティブを追加"
```

---

## Task 4: `TableOfContents.tsx` をリファクタ

**Files:**

- Modify: `src/components/TableOfContents.tsx`

エクスポート名を `TableOfContents` → `TocSidebar`、`MobileTocButton` → `TocDrawer` に変更。内部で `TocList` コンポーネントを共有。`useActiveHeading`・`FloatingButton`・`Drawer` を使用。

- [ ] **Step 1: ファイルをまるごと書き換える**

```tsx
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
    <nav className="hidden lg:block w-48 shrink-0">
      <div className="sticky top-24">
        <div className="border-l-2 border-[var(--accent)] pl-4">
          <p className="mb-2 text-xs font-semibold text-[var(--accent)]">目次</p>
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
      <FloatingButton onClick={() => setOpen(true)} aria-label="目次を開く" position="bottom-right">
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
        <TocList headings={headings} activeId={activeId} onItemClick={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add src/components/TableOfContents.tsx
git commit -m "refactor: TableOfContentsをTocSidebar/TocDrawerにリファクタ"
```

---

## Task 5: `blog/[slug]/page.tsx` のimportを更新

**Files:**

- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: importと使用箇所を更新**

ファイルの該当箇所を以下のように変更する：

```tsx
// 変更前
import { TableOfContents, MobileTocButton } from "@/components/TableOfContents";

// 変更後
import { TocSidebar, TocDrawer } from "@/components/TableOfContents";
```

```tsx
// 変更前
      <TableOfContents headings={headings} />
      <MobileTocButton headings={headings} />

// 変更後
      <TocSidebar headings={headings} />
      <TocDrawer headings={headings} />
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "refactor: blog pageのTOCインポート名を更新"
```

---

## Task 6: `NoteLayout.tsx` をリファクタ

**Files:**

- Modify: `src/components/NoteLayout.tsx`

インラインのTOCロジック（`useActiveHeading`相当・TOCリスト・TOCドロワー）を削除し、`TocSidebar`/`TocDrawer` を使用。ページリストのモバイルドロワーを `FloatingButton`/`Drawer` で置き換え。

- [ ] **Step 1: ファイルをまるごと書き換える**

```tsx
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

export function NoteLayout({ currentPage, currentSlug, notes, headings, children }: Props) {
  const [pagesOpen, setPagesOpen] = useState(false);
  const pageTitle = currentPage.replace(/_/g, " ");

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 lg:px-8">
      <div className="flex gap-8">
        {/* Left sidebar - page list (desktop) */}
        <nav className="hidden lg:block w-48 shrink-0">
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
      <Drawer open={pagesOpen} onClose={() => setPagesOpen(false)} title={pageTitle}>
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
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add src/components/NoteLayout.tsx
git commit -m "refactor: NoteLayoutをTocSidebar/TocDrawer/Drawer/FloatingButtonを使うよう更新"
```

---

## Task 7: ビルド確認

**Files:** なし（確認のみ）

- [ ] **Step 1: プロダクションビルドを実行**

```bash
npm run build
```

Expected: エラーなし。全ページが静的生成される。

- [ ] **Step 2: 動作確認チェックリスト**

ローカルで `npm run dev` を起動し、以下を確認：

- `/blog/[任意のslug]` でデスクトップTOCがハイライトされる
- `/blog/[任意のslug]` でモバイルFABを開くとドロワーが表示されアクティブ項目が色付き
- `/note/[page]/[slug]` でデスクトップTOCと左ページリストが正常表示
- `/note/[page]/[slug]` でモバイルの左FAB（ページ一覧）と右FAB（目次）が両方動作する

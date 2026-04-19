# デザインリニューアル Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ssshhhooota blog を「モダン・テック × 上品」なデザインにフルリニューアルする。

**Architecture:** カラーパレットをCSS変数で管理し、Tailwind CSS v4のユーティリティクラスでスタイリング。フローティングヘッダー、カードグリッド、サイドバー目次を導入。Note セクションを新規追加。

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript

---

## File Structure

| File                                      | Action | Responsibility                              |
| ----------------------------------------- | ------ | ------------------------------------------- |
| `src/app/globals.css`                     | Modify | カラーパレットCSS変数、アニメーション定義   |
| `src/app/layout.tsx`                      | Modify | max-w拡大、フェードインアニメーション       |
| `src/components/Header.tsx`               | Modify | フローティングヘッダー + 4ナビリンク        |
| `src/components/ThemeToggle.tsx`          | Modify | カラーパレット対応                          |
| `src/components/PostCard.tsx`             | Modify | カードグリッド対応、ホバーアニメーション    |
| `src/app/page.tsx`                        | Modify | カードグリッドレイアウト                    |
| `src/app/tags/[tag]/page.tsx`             | Modify | カードグリッドレイアウト + ティールタイトル |
| `src/components/TableOfContents.tsx`      | Modify | サイドバー目次 + Intersection Observer      |
| `src/app/blog/[slug]/page.tsx`            | Modify | サイドバー目次レイアウト                    |
| `src/app/scrap/[slug]/page.tsx`           | Modify | 記事ヘッダーのカラーパレット対応            |
| `src/components/Footer.tsx`               | Modify | カラーパレット対応                          |
| `src/lib/posts.ts`                        | Modify | Note エントリー関数追加                     |
| `src/app/note/page.tsx`                   | Create | Note 一覧ページ                             |
| `src/app/note/[category]/[slug]/page.tsx` | Create | Note 記事ページ                             |
| `src/components/PageTransition.tsx`       | Create | ページ遷移フェードインアニメーション        |
| `src/components/CodeBlockEnhancer.tsx`    | Modify | ダークモードのCopyボタンカラー対応          |

---

### Task 1: カラーパレットとCSS変数

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: CSS変数をカラーパレットに更新**

`src/app/globals.css` の `:root` と `.dark` セクションを以下に置き換え:

```css
:root {
  --bg: #fafaf9;
  --fg: #1c1917;
  --sub: #78716c;
  --border: #e7e5e4;
  --accent: #0d9488;
  --accent-light: #ccfbf1;
  --accent-surface: #f0fdfa;
  --card-bg: #ffffff;
  --amber: #d97706;
  --amber-light: #fef3c7;
}

.dark {
  --bg: #1c1917;
  --fg: #fafaf9;
  --sub: #a8a29e;
  --border: #44403c;
  --accent: #2dd4bf;
  --accent-light: rgba(13, 148, 136, 0.15);
  --accent-surface: rgba(13, 148, 136, 0.08);
  --card-bg: #292524;
  --amber: #fbbf24;
  --amber-light: rgba(217, 119, 6, 0.15);
}
```

- [ ] **Step 2: エントリーアニメーションのキーフレームを追加**

`globals.css` の末尾に追加:

```css
/* Page entry animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

- [ ] **Step 3: コードブロックのカラーをCSS変数に更新**

`globals.css` のコードブロック関連のハードコードされた色を CSS 変数に置き換える。具体的には:

- `.code-block-wrapper [data-rehype-pretty-code-title]` の `color` → `var(--sub)`, `background-color` → `var(--card-bg)`, `border-color` → `var(--border)`
- `.dark .code-block-wrapper [data-rehype-pretty-code-title]` セクションを削除（CSS変数が自動でダーク対応するため）
- `pre[data-theme]` の `border` → `1px solid var(--border)`, `background-color` → `var(--card-bg) !important`
- `.dark pre[data-theme]` セクションを削除
- `.prose :where(code):not(pre code)` の `background-color` → `var(--accent-surface)`, `border` → `1px solid var(--border)`
- `.dark .prose :where(code):not(pre code)` セクションを削除
- 行番号の `background-color` と `color` も CSS 変数に置き換え、`.dark` セクションを削除

- [ ] **Step 4: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 5: コミット**

```bash
git add src/app/globals.css
git commit -m "style: カラーパレットをCSS変数に統一し、エントリーアニメーションを追加"
```

---

### Task 2: フローティングヘッダー

**Files:**

- Modify: `src/components/Header.tsx`
- Modify: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Header.tsx をフローティングヘッダーに書き換え**

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Blog" },
  { href: "/scrap", label: "Scrap" },
  { href: "/note", label: "Note" },
  { href: "/tags", label: "Tags" },
];

export function Header() {
  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 mb-8 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 shadow-sm backdrop-blur-xl">
      <Link href="/" className="text-lg font-bold tracking-tight text-[var(--fg)]">
        ssshhhooota
      </Link>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: ThemeToggle.tsx のカラーをCSS変数対応に更新**

`className` を以下に変更:

```tsx
className =
  "p-1.5 rounded text-[var(--sub)] hover:text-[var(--accent)] transition-colors cursor-pointer";
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/components/Header.tsx src/components/ThemeToggle.tsx
git commit -m "feat: フローティングヘッダーとナビゲーションリンクを追加"
```

---

### Task 3: レイアウト幅の拡大とページ遷移アニメーション

**Files:**

- Modify: `src/app/layout.tsx`
- Create: `src/components/PageTransition.tsx`

- [ ] **Step 1: PageTransition コンポーネントを作成**

```tsx
// src/components/PageTransition.tsx
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in-up">{children}</div>;
}
```

- [ ] **Step 2: layout.tsx を更新**

`body` の `className` を `max-w-2xl` → `max-w-4xl` に変更し、`main` を `PageTransition` でラップする:

```tsx
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "ssshhhooota blog",
  description: "Personal tech blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className="mx-auto max-w-4xl px-4 antialiased">
        <Header />
        <main className="min-h-[60vh] py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/app/layout.tsx src/components/PageTransition.tsx
git commit -m "feat: レイアウト幅拡大とページ遷移アニメーションを追加"
```

---

### Task 4: PostCard をカードデザインに変更

**Files:**

- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: PostCard をカードスタイルに書き換え**

```tsx
import Link from "next/link";
import type { EntryMeta } from "@/lib/posts";

export function PostCard({ entry, basePath }: { entry: EntryMeta; basePath: string }) {
  const isBlog = basePath === "/blog";

  return (
    <article>
      <Link
        href={`${basePath}/${entry.slug}`}
        className="group block rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${
              isBlog ? "text-[var(--accent)]" : "text-[var(--amber)]"
            }`}
          >
            {isBlog ? "blog" : "scrap"}
          </span>
          <span className="text-xs text-[var(--sub)]">{entry.created}</span>
        </div>
        <h2 className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
          {entry.title}
        </h2>
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
```

注意: タグのクリックはカード全体のリンクと競合するため、カード内のタグはリンクではなく表示のみにする。タグ一覧ページへの導線はヘッダーのTagsリンクで提供。

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/components/PostCard.tsx
git commit -m "style: PostCard をカードデザインに変更しホバーアニメーションを追加"
```

---

### Task 5: トップページをカードグリッドに変更

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: page.tsx をグリッドレイアウトに変更**

```tsx
import { getAllPosts, getAllScraps, type EntryMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts: (EntryMeta & { basePath: string })[] = getAllPosts().map((e) => ({
    ...e,
    basePath: "/blog",
  }));
  const scraps: (EntryMeta & { basePath: string })[] = getAllScraps().map((e) => ({
    ...e,
    basePath: "/scrap",
  }));

  const all = [...posts, ...scraps].sort((a, b) => (a.created > b.created ? -1 : 1));

  return (
    <section>
      <h1 className="sr-only">記事一覧</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {all.map((entry) => (
          <PostCard
            key={`${entry.basePath}-${entry.slug}`}
            entry={entry}
            basePath={entry.basePath}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/app/page.tsx
git commit -m "style: トップページをカードグリッドレイアウトに変更"
```

---

### Task 6: タグページの更新

**Files:**

- Modify: `src/app/tags/[tag]/page.tsx`

- [ ] **Step 1: タグページをカードグリッド + ティールタイトルに更新**

```tsx
import { getAllTags, getEntriesByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const entries = getEntriesByTag(decoded);

  if (entries.length === 0) notFound();

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold text-[var(--accent)]">#{decoded}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <PostCard
            key={`${entry.basePath}-${entry.slug}`}
            entry={entry}
            basePath={entry.basePath}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/app/tags/[tag]/page.tsx
git commit -m "style: タグページをカードグリッドに変更しタイトルをティールカラーに"
```

---

### Task 7: タグ一覧ページの作成

**Files:**

- Create: `src/app/tags/page.tsx`

- [ ] **Step 1: タグ一覧ページが存在するか確認**

ヘッダーの `/tags` リンクの遷移先として、全タグを一覧するページが必要。

- [ ] **Step 2: タグ一覧ページを作成**

```tsx
// src/app/tags/page.tsx
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Tags</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {tag}
            <span className="ml-1.5 text-xs text-[var(--sub)]">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/app/tags/page.tsx
git commit -m "feat: タグ一覧ページを追加"
```

---

### Task 8: Scrap 一覧ページの作成

**Files:**

- Create: `src/app/scrap/page.tsx`

- [ ] **Step 1: Scrap 一覧ページを作成**

ヘッダーの `/scrap` リンクの遷移先。

```tsx
// src/app/scrap/page.tsx
import { getAllScraps, type EntryMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function ScrapListPage() {
  const scraps: (EntryMeta & { basePath: string })[] = getAllScraps().map((e) => ({
    ...e,
    basePath: "/scrap",
  }));

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Scrap</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scraps.map((entry) => (
          <PostCard key={entry.slug} entry={entry} basePath={entry.basePath} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/app/scrap/page.tsx
git commit -m "feat: Scrap 一覧ページを追加"
```

---

### Task 9: Note セクション — lib/posts.ts に Note 関数を追加

**Files:**

- Modify: `src/lib/posts.ts`

- [ ] **Step 1: Note 用の型と関数を追加**

`src/lib/posts.ts` の末尾に以下を追加:

```ts
// Note
// Notes are organized in subdirectories: content/note/<category>/<slug>.md
export type NoteMeta = EntryMeta & { category: string };

function getNoteDir() {
  return path.join(CONTENT_DIR, "note");
}

export function getAllNoteCategories(): string[] {
  const dir = getNoteDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getNoteSlugs(category: string): string[] {
  const dir = path.join(getNoteDir(), category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getNoteBySlug(category: string, slug: string): { meta: NoteMeta; content: string } {
  const filePath = path.join(getNoteDir(), category, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      category,
      title: extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    },
    content: normalizeCodeBlocks(stripTitle(content)),
  };
}

export function getAllNotes(): NoteMeta[] {
  const categories = getAllNoteCategories();
  const notes: NoteMeta[] = [];
  for (const category of categories) {
    for (const slug of getNoteSlugs(category)) {
      const filePath = path.join(getNoteDir(), category, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      if (data.public === false) continue;
      notes.push({
        slug,
        category,
        title: extractTitle(slug, content),
        created: parseDate(data.created),
        updated: parseDate(data.updated),
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: parseThumbnail(data.thumbnail),
      });
    }
  }
  return notes.sort((a, b) => (a.created > b.created ? -1 : 1));
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/lib/posts.ts
git commit -m "feat: Note セクション用のデータ取得関数を追加"
```

---

### Task 10: Note 一覧ページと記事ページの作成

**Files:**

- Create: `src/app/note/page.tsx`
- Create: `src/app/note/[category]/[slug]/page.tsx`

- [ ] **Step 1: Note 一覧ページを作成**

```tsx
// src/app/note/page.tsx
import Link from "next/link";
import { getAllNotes } from "@/lib/posts";

export default function NoteListPage() {
  const notes = getAllNotes();

  // Group by category
  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    const list = grouped.get(note.category) ?? [];
    list.push(note);
    grouped.set(note.category, list);
  }

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Note</h1>
      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([category, categoryNotes]) => (
          <div key={category}>
            <h2 className="mb-3 text-base font-semibold text-[var(--accent)]">
              {category.replace(/_/g, " ")}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {categoryNotes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/note/${note.category}/${note.slug}`}
                  className="group block rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
                >
                  <div className="mb-1 text-xs text-[var(--sub)]">{note.created}</div>
                  <div className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {note.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Note 記事ページを作成**

```tsx
// src/app/note/[category]/[slug]/page.tsx
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getNoteBySlug, getAllNoteCategories, getNoteSlugs } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";

export async function generateStaticParams() {
  const categories = getAllNoteCategories();
  const params: { category: string; slug: string }[] = [];
  for (const category of categories) {
    for (const slug of getNoteSlugs(category)) {
      params.push({ category, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { meta } = getNoteBySlug(category, slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { meta, content } = getNoteBySlug(category, slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" } }],
        ],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
          <span className="text-xs font-semibold text-[var(--accent)]">note</span>
          <span className="text-xs text-[var(--sub)]">{category.replace(/_/g, " ")}</span>
          <time>作成: {meta.created}</time>
          {meta.updated && meta.updated !== meta.created && <time>更新: {meta.updated}</time>}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
      </header>
      <CodeBlockEnhancer>
        <div className="prose prose-neutral max-w-none dark:prose-invert">{mdxContent}</div>
      </CodeBlockEnhancer>
    </article>
  );
}
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/app/note/page.tsx src/app/note/[category]/[slug]/page.tsx
git commit -m "feat: Note 一覧ページと記事ページを追加"
```

---

### Task 11: サイドバー目次コンポーネントの実装

**Files:**

- Modify: `src/components/TableOfContents.tsx`

- [ ] **Step 1: TableOfContents をサイドバー対応に書き換え**

Intersection Observer で現在のセクションをハイライトするクライアントコンポーネントに変更:

```tsx
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
      { rootMargin: "-80px 0px -80% 0px" },
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
        <div className="border-l-2 border-[var(--accent-light)] pl-4">
          <p className="mb-2 text-xs font-semibold text-[var(--accent)]">目次</p>
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

// Mobile fallback: inline TOC shown on smaller screens
export function InlineTableOfContents({ headings }: { headings: TocHeading[] }) {
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
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: コミット**

```bash
git add src/components/TableOfContents.tsx
git commit -m "feat: サイドバー目次をIntersection Observer対応に書き換え"
```

---

### Task 12: 記事ページをサイドバー目次レイアウトに変更

**Files:**

- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/scrap/[slug]/page.tsx`

- [ ] **Step 1: blog/[slug]/page.tsx をサイドバーレイアウトに変更**

```tsx
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs, extractHeadings } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";
import { TableOfContents, InlineTableOfContents } from "@/components/TableOfContents";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const headings = extractHeadings(content);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" } }],
        ],
      },
    },
  });

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
            <span className="text-xs font-semibold text-[var(--accent)]">blog</span>
            <time>作成: {meta.created}</time>
            {meta.updated && meta.updated !== meta.created && <time>更新: {meta.updated}</time>}
          </div>
          <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
          {meta.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
          <InlineTableOfContents headings={headings} />
        </header>
        <CodeBlockEnhancer>
          <div className="prose prose-neutral max-w-none dark:prose-invert">{mdxContent}</div>
        </CodeBlockEnhancer>
      </article>
      <TableOfContents headings={headings} />
    </div>
  );
}
```

- [ ] **Step 2: scrap/[slug]/page.tsx のスタイルをカラーパレットに更新**

```tsx
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getScrapBySlug, getScrapSlugs } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";

export async function generateStaticParams() {
  return getScrapSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getScrapBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function ScrapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getScrapBySlug(slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" } }],
        ],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
          <span className="text-xs font-semibold text-[var(--amber)]">scrap</span>
          <time>作成: {meta.created}</time>
          {meta.updated && meta.updated !== meta.created && <time>更新: {meta.updated}</time>}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
        {meta.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meta.tags.map((tag) => (
              <a
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </header>
      <CodeBlockEnhancer>
        <div className="prose prose-neutral max-w-none dark:prose-invert">{mdxContent}</div>
      </CodeBlockEnhancer>
    </article>
  );
}
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/app/blog/[slug]/page.tsx src/app/scrap/[slug]/page.tsx
git commit -m "feat: 記事ページにサイドバー目次レイアウトを適用"
```

---

### Task 13: Footer とCodeBlockEnhancer のカラーパレット対応

**Files:**

- Modify: `src/components/Footer.tsx`
- Modify: `src/components/CodeBlockEnhancer.tsx`

- [ ] **Step 1: Footer のカラーを CSS 変数に更新**

```tsx
export function Footer() {
  return (
    <footer className="py-8 text-sm text-[var(--sub)]">
      <p>&copy; {new Date().getFullYear()} ssshhhooota</p>
    </footer>
  );
}
```

- [ ] **Step 2: CodeBlockEnhancer の Copy ボタンカラーをダークモード対応に更新**

`src/components/CodeBlockEnhancer.tsx` の Copy ボタンの `className` を変更:

```ts
btn.className =
  "absolute top-1.5 right-2 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-[var(--card-bg)]/80 border border-[var(--border)] rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10";
```

また、言語ラベルの `className` はそのままで問題なし。

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 4: コミット**

```bash
git add src/components/Footer.tsx src/components/CodeBlockEnhancer.tsx
git commit -m "style: Footer と CodeBlockEnhancer のカラーパレット対応"
```

---

### Task 14: 最終ビルドと動作確認

**Files:** なし（確認のみ）

- [ ] **Step 1: フルビルド**

Run: `npm run build`
Expected: エラーなしでビルド成功

- [ ] **Step 2: 開発サーバーで目視確認**

Run: `npm run dev`

確認項目:

- トップページ: カードグリッドが2カラムで表示される
- ヘッダー: フローティング、backdrop-blur、4つのナビリンクが機能する
- 記事ページ: サイドバー目次がスクロール追従し、セクションがハイライトされる
- ダークモード: テーマ切替が正常に動作し、カラーが適切に切り替わる
- ホバーアニメーション: カードのホバーで浮き上がり効果がある
- モバイル表示: 1カラムカード、インライン目次にフォールバック
- Note ページ: `/note` で一覧、`/note/1password_cli/commands` で記事が表示される
- Tags ページ: `/tags` で全タグ一覧が表示される
- Scrap ページ: `/scrap` で scrap 一覧が表示される

- [ ] **Step 3: .superpowers を .gitignore に追加**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: .superpowers をgitignoreに追加"
```

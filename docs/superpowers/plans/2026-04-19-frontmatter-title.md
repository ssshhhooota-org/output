# Frontmatter Title 優先使用 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** blog/scrap/note の全コンテンツ種別で frontmatter `title` フィールドを優先してタイトルを取得し、途中の `# 見出し` が誤ってタイトルに使われるバグを修正する。

**Architecture:** `src/lib/posts.ts` の4関数（`getEntry`・`getAllEntries`・`getNoteBySlug`・`getNotesByPage`）でタイトル取得を `data.title || extractTitle(slug, content)` に統一する。note は `stripTitle` の呼び出しも削除する。

**Tech Stack:** TypeScript, gray-matter (frontmatter パーサー)

---

### Task 1: `getEntry` と `getAllEntries` (blog/scrap) を修正する

**Files:**
- Modify: `src/lib/posts.ts`（`getEntry` 関数 L69–86、`getAllEntries` 関数 L97–115）

- [ ] **Step 1: `getEntry` 関数のタイトル取得を変更する**

`src/lib/posts.ts` L79 を以下のように変更する：

変更前:
```ts
      title: extractTitle(slug, content),
```

変更後:
```ts
      title: data.title || extractTitle(slug, content),
```

- [ ] **Step 2: `getAllEntries` 関数のタイトル取得を変更する**

`src/lib/posts.ts` L106 を以下のように変更する：

変更前:
```ts
        title: extractTitle(slug, content),
```

変更後:
```ts
        title: data.title || extractTitle(slug, content),
```

- [ ] **Step 3: ビルドが通ることを確認する**

```bash
npm run build
```

Expected: エラーなくビルド完了

- [ ] **Step 4: コミットする**

```bash
git add src/lib/posts.ts
git commit -m "fix: blog/scrapのタイトル取得でfrontmatterのtitleを優先する"
```

---

### Task 2: `getNoteBySlug` と `getNotesByPage` (note) を修正する

**Files:**
- Modify: `src/lib/posts.ts`（`getNoteBySlug` 関数 L177–194、`getNotesByPage` 関数 L196–214）

- [ ] **Step 1: `getNoteBySlug` のタイトル取得と `stripTitle` を変更する**

`src/lib/posts.ts` の `getNoteBySlug` 関数 L177–194 を以下のように変更する：

変更前:
```ts
  return {
    meta: {
      slug,
      page,
      title: extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    },
    content: normalizeCodeBlocks(stripTitle(content)),
  };
```

変更後:
```ts
  return {
    meta: {
      slug,
      page,
      title: data.title || extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    },
    content: normalizeCodeBlocks(content),
  };
```

- [ ] **Step 2: `getNotesByPage` のタイトル取得を変更する**

`src/lib/posts.ts` の `getNotesByPage` 関数内 L206 を以下のように変更する：

変更前:
```ts
      title: extractTitle(slug, content),
```

変更後:
```ts
      title: data.title || extractTitle(slug, content),
```

- [ ] **Step 3: ビルドが通ることを確認する**

```bash
npm run build
```

Expected: エラーなくビルド完了

- [ ] **Step 4: コミットする**

```bash
git add src/lib/posts.ts
git commit -m "fix: noteのタイトル取得でfrontmatterのtitleを優先し、stripTitleを削除する"
```

---

### Task 3: 動作確認する

- [ ] **Step 1: dev サーバーを起動する**

```bash
npm run dev
```

- [ ] **Step 2: note ページを確認する**

ブラウザで `/note/<page>/<slug>` を開き、frontmatter の `title` がページの `<h1>` に正しく表示されていることを確認する。

- [ ] **Step 3: blog ページを確認する**

ブラウザで `/blog/Lazygitの紹介` を開き、タイトルが `lazysqlの紹介`（旧: コンテンツから抽出）ではなく `Lazygitの紹介`（frontmatter の値）になっていることを確認する。

- [ ] **Step 4: 一覧ページを確認する**

`/blog`・`/note` の一覧ページを開き、各カードのタイトルが frontmatter の値と一致していることを確認する。

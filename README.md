# ssshhhooota output

Next.js (App Router) + SSG で構築した個人技術ブログ。

## Tech Stack

- Next.js 16 (App Router / SSG)
- TypeScript
- Tailwind CSS v4 + @tailwindcss/typography
- next-mdx-remote (Markdown レンダリング)
- rehype-pretty-code + shiki (シンタックスハイライト)
- remark-gfm (テーブル等 GFM 対応)

## Structure

```
content/
├── blog/       # ブログ記事 (*.md)
├── scrap/      # スクラップ (*.md)
└── assets/     # 画像等
src/
├── app/
│   ├── page.tsx              # トップ: blog + scrap 混合一覧
│   ├── blog/[slug]/page.tsx  # ブログ記事詳細
│   └── scrap/[slug]/page.tsx # スクラップ詳細
├── components/
│   └── CodeBlockEnhancer.tsx # 言語名・ファイル名・Copyボタン
└── lib/
    └── posts.ts              # Markdown 読み込み・パース
```

## Markdown Format

```markdown
---
created: 2026/02/15 12:00
updated: 2026/02/15 12:50
tags:
  - Next.js
public: true
thumbnail: "[[image.png]]"
---

# タイトル (本文の最初の見出しから取得)
```

- `public: false` の記事は非公開
- コードブロックのファイル名指定: `` ```ts:hoge.ts ``

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Content Sync

コンテンツは別リポジトリで管理。push 時に GitHub Actions でこのリポジトリの `content/` に同期 → Vercel が自動ビルド。

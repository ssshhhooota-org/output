# Frontmatter title を全コンテンツ種別で優先使用する

**日付:** 2026-04-19

## 問題

`src/lib/posts.ts` の `extractTitle` 関数はコンテンツ内の `# 見出し` からタイトルを抽出するが、frontmatter の `title` フィールドを無視している。これにより以下の2つのバグが発生している。

1. **frontmatter `title` が使われない** — blog/scrap/note すべてで frontmatter に `title` を設定しているが、無視されている
2. **途中の `# 見出し` がタイトルになる** — `extractTitle` の正規表現に `m`（マルチライン）フラグがあるため、コンテンツ先頭でなくても `# heading` があればタイトルとして採用されてしまう（例: note ページ詳細）

## 設計

### 変更対象ファイル

`src/lib/posts.ts` のみ。

### 変更内容

以下4箇所でタイトル取得ロジックを統一する。

| 関数 | 変更 |
|------|------|
| `getEntry` | `extractTitle(slug, content)` → `data.title \|\| extractTitle(slug, content)` |
| `getAllEntries` | 同上 |
| `getNoteBySlug` | 同上 ＋ `stripTitle` の呼び出しを削除 |
| `getNotesByPage` | `extractTitle(slug, content)` → `data.title \|\| extractTitle(slug, content)` |

### note の `stripTitle` 削除について

- blog/scrap はページの `<h1>` を `meta.title` で描画しつつ、コンテンツの `# Title` を `stripTitle` で除去して重複を防ぐ設計
- note はコンテンツに `# Title` を書かない（frontmatter `title` で管理）ため、`stripTitle` が不要。コンテンツ途中の `# 見出し` を誤って削除するリスクを排除する

### フォールバック戦略

frontmatter に `title` がない場合は従来通り `extractTitle(slug, content)` → slug の順でフォールバックする。後方互換性を維持。

## 対象外

- `extractTitle` 関数自体の正規表現修正（`m` フラグの除去）は、フォールバック時のみ使われるため影響範囲が小さく、今回はスコープ外とする
- blog/scrap の `stripTitle` 挙動は変更しない

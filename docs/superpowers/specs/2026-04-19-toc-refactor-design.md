# TOC コンポーネントリファクタリング設計

**日付:** 2026-04-19  
**対象ブランチ:** update-content

---

## 背景・目的

現状、スクロール検出ロジック・TOCリスト・ドロワーUIが以下の3箇所に重複している：

- `src/components/TableOfContents.tsx`（デスクトップ・モバイルの2箇所）
- `src/components/NoteLayout.tsx`（インライン実装）

これを3層構造（Hook / UI Primitives / 機能コンポーネント）に整理し、重複を排除する。

---

## アーキテクチャ

```
src/
  hooks/
    useActiveHeading.ts        ← NEW: スクロール検出ロジック
  components/
    ui/
      Drawer.tsx               ← NEW: 汎用ボトムドロワー
      FloatingButton.tsx       ← NEW: 汎用FABボタン
    TableOfContents.tsx        ← MODIFY: TocSidebar + TocDrawer にリファクタ
    NoteLayout.tsx             ← MODIFY: TocSidebar/TocDrawer を再利用
  app/
    blog/[slug]/page.tsx       ← MODIFY: import名を更新
```

---

## Layer 1: Hook

### `src/hooks/useActiveHeading.ts`

```ts
function useActiveHeading(headings: TocHeading[]): string
```

**責務:** スクロール位置に基づいてアクティブな見出しIDを返す

- `window` の `scroll` イベントを `passive: true` でリッスン
- `HEADER_OFFSET = 80` px 以内に入った最後の見出しIDを `activeId` として返す
- `headings` が空の場合は即 `""` を返す（イベント登録なし）
- アンマウント時にイベントリスナーを削除

---

## Layer 2: UI Primitives

### `src/components/ui/Drawer.tsx`

```tsx
type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**責務:** モバイル向けボトムシートドロワーのUIを提供

- `open` が `true` のとき backdrop（`bg-black/40 backdrop-blur-sm`）を表示
- パネルは `translate-y-full` ↔ `translate-y-0` のCSSトランジション（300ms ease-out）
- ヘッダー部分（タイトル + ×ボタン）を内包し、`children` にリスト等を渡す
- backdrop クリックと×ボタンで `onClose` を呼ぶ

### `src/components/ui/FloatingButton.tsx`

```tsx
type FloatingButtonProps = {
  onClick: () => void;
  "aria-label": string;
  position: "bottom-left" | "bottom-right";
  children: React.ReactNode;
}
```

**責務:** 画面固定の丸いFABボタン

- `bg-[var(--accent)]`、白アイコン、`shadow-lg`
- `hover:scale-105 active:scale-95` のトランジション
- `position` で `bottom-6 left-6` または `bottom-6 right-6` を切り替え
- `lg:hidden`（デスクトップでは非表示）

---

## Layer 3: 機能コンポーネント

### `src/components/TableOfContents.tsx`（リファクタ）

**エクスポート:**

```tsx
export function TocSidebar({ headings }: { headings: TocHeading[] })
export function TocDrawer({ headings }: { headings: TocHeading[] })
```

- `TocSidebar`: `useActiveHeading` を使い、デスクトップ用サイドバーをレンダリング（`hidden lg:block`）
- `TocDrawer`: `useActiveHeading` + `FloatingButton` + `Drawer` を使い、モバイル用FAB+ドロワーをレンダリング（`lg:hidden`）
- TOCリストのアイテム（アクティブ状態のスタイル）は両コンポーネントで共通の内部 `TocList` コンポーネントとして切り出す

### `src/components/NoteLayout.tsx`（リファクタ）

- インライン実装していた TOC ロジック（`useActiveHeading` 相当・TOCリスト）を削除
- `TocSidebar`・`TocDrawer` を import して使う
- ページリスト（左サイドバー）は `NoteLayout` 固有のUIのため残す
  - デスクトップ: インラインのまま
  - モバイル: `FloatingButton`（`position="bottom-left"`）+ `Drawer` を使うようリファクタ

---

## 変更ファイル一覧

| ファイル | 変更種別 | 内容 |
|---|---|---|
| `src/hooks/useActiveHeading.ts` | 新規 | スクロール検出hook |
| `src/components/ui/Drawer.tsx` | 新規 | 汎用ドロワー |
| `src/components/ui/FloatingButton.tsx` | 新規 | 汎用FAB |
| `src/components/TableOfContents.tsx` | 変更 | TocSidebar/TocDrawer にリファクタ |
| `src/components/NoteLayout.tsx` | 変更 | 共有コンポーネントを使うよう更新 |
| `src/app/blog/[slug]/page.tsx` | 変更 | import名を更新 |

---

## 非目標

- 新機能の追加
- スタイルの変更
- `PostCard`・`Header`・`Footer` 等、今回の作業と無関係なコンポーネントの変更

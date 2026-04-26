---
created: 2026/04/26
updated: 2026/04/26
tags:
  - git
public: true
thumbnail:
---

# gitignore パターン一覧

## 全パターン

| # | 場所 | スコープ | Git管理 | 備考 |
|---|------|---------|---------|------|
| 1 | `~/.config/git/ignore` | 全リポジトリ | × | XDGデフォルト、設定不要 |
| 2 | `~/.gitignore_global` | 全リポジトリ | × | `core.excludesFile`で指定必要 |
| 3 | `任意パス.gitignore` | 全リポジトリ | × | `core.excludesFile`で指定 |
| 4 | `.gitignore` (ルート) | リポジトリ全体 | ○ | チーム共有 |
| 5 | サブディレクトリの`.gitignore` | そのdir以下 | ○ | チーム共有 |
| 6 | `.git/info/exclude` | リポジトリ全体 | × | 個人設定、clone時に引き継がれない |
| 7 | `includeIf` + `excludesFile` | 特定dir群 | × | ディレクトリ単位で切り替え |

優先順位（高→低）：ローカル`.gitignore` → `.git/info/exclude` → グローバル

## 各パターンの詳細

### 1. `~/.config/git/ignore`
XDG準拠のデフォルトパス。`core.excludesFile` 設定不要で自動読み込み。

### 2. `~/.gitignore_global`
```ini
# ~/.gitconfig
[core]
    excludesFile = ~/.gitignore_global
```

### 3. `includeIf` + `excludesFile`
ディレクトリごとに異なる ignore を適用したい場合。
```ini
# ~/.gitconfig
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
```
```ini
# ~/.gitconfig-work
[core]
    excludesFile = ~/.gitignore-work
```

### 4. `.git/info/exclude`
リポジトリ単位の個人設定。Git管理外なのでチームには共有されない。

### 5. サブディレクトリの `.gitignore`
そのディレクトリ以下にのみ適用される。

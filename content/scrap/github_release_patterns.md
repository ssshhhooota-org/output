---
created: 2026/04/26
updated: 2026/04/26 17:16
tags:
  - git
  - github
public: true
thumbnail:
---

# GitHub リリースパターン

## tag の基本

```bash
# タグ作成（軽量タグ）
git tag v1.0.0

# タグ作成（注釈付き）
git tag -a v1.0.0 -m "Release v1.0.0"

# タグをリモートにpush
git push origin v1.0.0

# 全タグをpush
git push origin --tags

# タグ一覧
git tag

# タグ削除（ローカル）
git tag -d v1.0.0

# タグ削除（リモート）
git push origin --delete v1.0.0
```

## バージョニング規則

### Semantic Versioning（semver）
`MAJOR.MINOR.PATCH`

| 種別 | 説明 | 例 |
|------|------|----|
| MAJOR | 破壊的変更 | 1.0.0 → 2.0.0 |
| MINOR | 後方互換の新機能 | 1.0.0 → 1.1.0 |
| PATCH | バグ修正 | 1.0.0 → 1.0.1 |

プレリリース例：`v1.0.0-alpha.1`, `v1.0.0-beta.2`, `v1.0.0-rc.1`

## GitHub Release の作成パターン

### gh CLI で作成
```bash
# タグ作成 + リリース作成
gh release create v1.0.0 --title "v1.0.0" --notes "リリースノート"

# ドラフトで作成
gh release create v1.0.0 --draft

# プレリリースとして作成
gh release create v1.0.0 --prerelease

# ファイルを添付
gh release create v1.0.0 ./dist/app.zip

# 前回タグからの差分を自動生成
gh release create v1.0.0 --generate-notes
```

### GitHub Actions で自動リリース
```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
```

## リリースブランチ戦略

### GitHub Flow（シンプル）
- `main` ブランチにマージ → タグ打ち → リリース

### Git Flow
| ブランチ | 役割 |
|---------|------|
| `main` | リリース済みコード |
| `develop` | 開発ブランチ |
| `release/v1.0.0` | リリース準備 |
| `hotfix/xxx` | 緊急修正 |

### トランクベース開発
- 常に `main` をリリース可能な状態に保つ
- フィーチャーフラグで未完成機能を隠す

## CHANGELOG の書き方

```markdown
## [1.1.0] - 2026-04-26
### Added
- 新機能A

### Fixed
- バグ修正B

### Changed
- 仕様変更C

### Removed
- 削除した機能D
```

規約：[Keep a Changelog](https://keepachangelog.com/)

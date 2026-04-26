---
created: 2026/04/25 13:34
updated: 2026/04/26 17:11
tags:
public: true
thumbnail:
---

# gitconfig_includeIf

特定ディレクトリ配下のみに適用できるルール
会社用と個人開発用で分けたりできる

## includeIf の使い方

```ini
# ~/.gitconfig
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

```ini
# ~/.gitconfig-work
[user]
    email = work@company.com
[core]
    excludesFile = ~/.gitignore-work
```

- `gitdir:` のパス末尾に `/` が必要
- 指定ディレクトリ以下の全リポジトリに適用される

---
created: 2026/04/08 23:18
updated: 2026/04/19 17:12
tags:
  - Claude Code
  - Git
  - GitHub
public: true
thumbnail:
title: Claude CodeにGit操作をしてもらう最低限の設定
---

https://github.com/ssshhhooota/git_with_claude_code/

## 前提

- [gwq](https://github.com/d-kuro/gwq) のインストール
  - 正直、gwq使わなくてもgit worktreeコマンド使えるのでどちらでも良い
  - Claudeがworktreeを作る時は`.claude/worktrees/`に配置してもらうようにしている
    - `~/worktrees`に配置されると消すのを忘れるので目に入る近くにあった方が良い
    - [ghq](https://github.com/x-motemen/ghq)を使えば良いが、日常的に3つほどのリポジトリしか触らないのでghqは使っていない
- [GitHub CLI](https://cli.github.com/) のインストール
  - ルールで指定はしないが、ClaudeがPRを使う時はghコマンドを使っている
  - [Lazygit](https://github.com/jesseduffield/lazygit) でbranchに紐づくPRのstatusを取得するのに必要
  - [gh poi](https://github.com/seachicken/gh-poi)を使うのに必要

## Claudeに実装してもらうときの流れ

1. issueを作成する
2. issue番号をClaudeに渡して作業依頼
3. Claudeがworktree, branch作成
4. Claudeが作業を終えて、commit, push, pr create
5. 自分がレビューして自分がmerge
6. Claudeに対応完了の旨を伝えるとworktreeを削除してくれる
7. 自分が`gh poi`コマンドを叩く

- マージ済みローカルブランチを削除する
- LazygitのLocal Branches paneにいる時に`shift + c`で実行できるようショートカット設定をしている

## Claudeの制御

- PRのmergeは人間が行うようにしている
  - mergeをClaudeに行ってもらう癖がつくと、そのうち意図していないPRをmergeされる気がする
  - revertすれば良いが、mergeでリリースのciが動くプロジェクトだと困ることがありそう
  - `.claude/settings.json`でdeny指定している
- push, pr create, comment, issue createなどの操作は`~.claude/settings.json`でask指定して、確認してもらうようにしている
  - allow指定しても致命的な問題にはなり得ないと思うが、他の人に影響を及ぼしかねないので一応ask指定にしている

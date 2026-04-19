---
created: 2025/12/24 22:42
updated: 2026/02/15 12:07
tags:
public: true
thumbnail: "[[019c0520-2fda-74ed-96c0-8faf1f5eecd2.png]]"
title: Brewfileの運用
---

複数のPCで環境を揃えるときに運用方法が確立されていれば、ミスをすることが減らせるし環境構築が素早く行えるのでまとめておく

以下はメリット

- 環境の再現性
- バージョン管理
- ドキュメント化
- 一括管理
- クリーンアップが容易

## Brewfile

Homebrewの環境を定義するファイルで、インストールしたFormula, CaskやVSCの拡張機能の管理ができる
`brew bundle` コマンドを利用する
dotfilesの構成要素としてGit管理しても良い

## よく使うコマンド

`--global` オプションでホームディレクトリのBrewfileを利用する
`--file` でBrewfileのパスを指定できる

| コマンド名          | オプション   | 説明                                                                                              |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| brew bundle install |              | 未インストール → インストールする<br>インストール済み → 何もしない<br>古いバージョン → 何もしない |
| brew bundle cleanup |              | Brewfile になくて、インストール済みの削除対象のパッケージを出力する                               |
|                     | --force      | 実際にパッケージを削除する                                                                        |
| brew bundle check   |              | Brewfileに記載された未インストールのパッケージがあるかどうかを出力する                            |
|                     | --verbose    | Brewfile に記載された未インストールのパッケージを出力する                                         |
| brew bundle list    |              | Brewfile に記載されたパッケージを表示する<br>インストール済みのパッケージのリストではない         |
| brew bundle dump    |              |                                                                                                   |
|                     | --force      | 既存の Brewfile を更新                                                                            |
|                     | --describe   | パッケージの説明をコメントで追加                                                                  |
|                     | --no-upgrade | バージョン固定のオプションを追加                                                                  |

## 運用

### AのPC

1. Brewfile の作成
   - 初回: `brew bundle dump --global --describe`
   - 2回目移行: `brew bundle dump --global --force --describe`
2. GitHub 管理

### BのPC

1. Brewfile の取得・保存
2. Brewfile にあって未インストールのパッケージの対応
   - 確認: `brew bundle check --global`
   - インストールする場合:
     - 個別: `brew install [パッケージ名]`
     - 全て: `brew bundle install --global`
   - インストールしない場合: Brewfileを直接修正
3. Brewfile になくてインストール済みのパッケージの対応
   - 確認: `brew bundle cleanup --global`
   - アンインストールする場合:
     - 個別: `brew uninstall [パッケージ名]`
     - 全て: `brew bundle cleanup --global --force`
   - 孤立した依存パッケージの削除: `brew autoremove`
   - アンインストールしない場合: 次のBrewfile の更新へ
4. Brewfile の更新
   - `brew bundle dump --global --force --describe`

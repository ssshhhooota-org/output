---
created: 2026/04/19 15:17
updated: 2026/04/19 17:11
tags:
  - 1password cli
title: commands
---

`op -h` のGeneral Commands

see: https://developer.1password.com/docs/cli/reference/commands

## completion
cliのシェル補完スクリプトを生成する

```
# .zshrc に追加
eval "$(op completion zsh)"
compdef _op op
```

## inject
op inject は テンプレートファイル内のシークレットリファレンスを実際の値に置換して出力するコマンド  
基本使わない

-  基本形式
  op inject -i template.env -o .env

-  template.env (入力)
  DATABASE_URL=op://Development/DB/connection_string
  API_KEY=op://Development/Service/api_key
  SECRET=op://Private/App/secret

-  .env (出力) - 実際の値に置換される
  DATABASE_URL=postgres://user:pass@host/db
  API_KEY=sk-abc123
  SECRET=mysecretvalue

-  stdin/stdout でも使える
  cat template.conf | op inject > output.conf

他コマンドとの比較:
- op read → 1つの値を取得
- op run → 環境変数に注入してコマンドを実行
- op inject → ファイル内の参照を置換してファイルを出力（コマンド実行はしない）


## read
シークレットを読み取る
- 基本形式
  op read "op://保管庫名/アイテム名/フィールド名"

- 例: パスワードを取得
  op read "op://Private/GitHub/password"

-  例: APIキーを取得
  op read "op://Development/AWS/access_key"

-  例: 環境変数として使う
  export API_KEY=$(op read "op://Vault/Service/api_key")

主な用途:
- スクリプト内でパスワードやAPIキーを安全に参照
- 環境変数にシークレットを注入
- .env ファイルにハードコードせずに秘密情報を使う
- getとは異なり、フィールドの値だけ返す


## run
op run は 1Password CLI で環境変数にシークレットを注入してコマンドを実行するコマンド

- 基本形式
  op run --env-file=.env -- <コマンド>

  .env ファイル内のシークレットリファレンスを自動的に実際の値に置き換えて、子プロセスに渡します。

- .env ファイル
  DATABASE_URL=op://Development/DB/connection_string
  API_KEY=op://Development/Service/api_key

- 実行例
  op run --env-file=.env -- node server.js
  op run --env-file=.env -- docker compose up

op read との違い:
- op read → 1つの値を取得
- op run → 複数のシークレットをまとめて環境変数に注入してコマンドを実行

.env にシークレットを平文で書かずに済むので、安全にアプリケーションを起動できるのが利点です。

## signin
サインイン

## signout
サインアウト

## update
op cli事態を最新バージョンに更新する
brew経由でインストールした場合はbrew upgradeの方が良い

## whoami
サインイン中のアカウント情報取得


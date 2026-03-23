---
created: 2026/03/23 22:13
updated: 2026/03/23 23:23
tags:
  - lazysql
  - tui
public: true
thumbnail:
---

# lazysqlの紹介

## lazysqlの発見

開発時にWezterm(ターミナルエミュレータ)を利用しています。

データを確認するためにSequel Aceというデータベース管理GUIアプリケーションを使っていたのですが、WeztermとSequel Aceを行き来するのが億劫でした。

Raycastのようなランチャーアプリを使えばアプリの切り替えは簡単にできますが、せっかくWeztermを使っているのだからTerminal上で完結するTUIツールを探していました。

[awesome-tuis](https://github.com/rothgar/awesome-tuis) でlazysqlを見つけたので、試してみることにしました。

## インストール方法

環境によってインストール方法が異なるので、[公式ドキュメント](https://github.com/jorgerojas26/lazysql?tab=readme-ov-file#getting-started)を参照してください。

macOSの場合はHomebrewでインストールできます。

```sh
brew install lazysql
```

## 使い方

実際にMySQLコンテナを立ててlazysqlを試してみます。

すでに何かしらのDBが用意されているのであれば、そちらを使っても構いません。

```bash
docker run -d \
    --name mysql-dev \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=mydb \
    -p 3306:3306 \
    mysql:8
```

### 接続

以下のコマンドでlazysqlを起動します。

```bash
lazysql
```

接続情報を入力します。

- **Name**: 任意の名前
- **URL**: `mysql://root:root@localhost:3306/mydb`

入力後Enterを押すと、一覧画面に追加した接続名が表示されます。`c`を押すと接続されます。

接続に失敗するときは、MySQLコンテナが起動しているかURLが正しいかを確認してください。

URLをコマンドに直接渡すこともできます。

```bash
lazysql mysql://root:root@localhost:3306/mydb
```

`--read-only`オプションを付けると読み取り専用モードで接続でき、INSERT・UPDATE・DELETEなどの変更操作がブロックされます。

```bash
lazysql --read-only mysql://root:root@localhost:3306/mydb
```

### テーブル操作

新しくMySQLコンテナを作成した場合はテーブルやレコードがないので、作成します。

`Ctrl + e`でSQLエディタが表示されるので、以下のDDLを貼り付けます。

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

`Ctrl + r`で実行します。

`ESC`を押してエディタを閉じ、`Shift + H`で左サイドバーに戻りEnterを押すと、usersテーブルが作成されていることを確認できます。

```
mydb
 └──users
```

mydbにフォーカスされているので、`j`で下に移動します。  
usersを選択するとレコード一覧やカラム情報などが確認できます。

続けてレコードを挿入してみます。

```sql
INSERT INTO users (name, email) VALUES
('田中太郎', 'tanaka@example.com'),
('佐藤花子', 'sato@example.com'),
('鈴木一郎', 'suzuki@example.com');
```

サイドバーのusersを選択すると作成したレコードが確認できます。

### その他

基本的にvimライクな操作です。

`?`を押すと利用可能なキーバインド一覧が表示されます。

`q`でlazysqlを終了します。

確認が終わったらMySQLコンテナを破棄してください。

## 自分なりの使い方

TmuxのPopup機能を使って、起動できるようにしています。

lazysqlだけでなく、lazygit・lazydockerも同様に設定しています。

```:.tmux.conf
# lazygit
bind r popup -xC -yC -w90% -h90% -d '#{pane_current_path}' -E 'lazygit'
# lazysql
bind t popup -xC -yC -w90% -h90% -d '#{pane_current_path}' -E 'lazysql'
# lazydocker
bind y popup -xC -yC -w90% -h90% -d '#{pane_current_path}' -E 'lazydocker'
```

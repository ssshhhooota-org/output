---
created: 2025/11/06 23:01
updated: 2026/02/15 12:07
tags:
public: true
thumbnail: "[[019c051c-e2d4-74e1-97d8-d1828878d66f.png]]"
---

## ルートユーザが使われたらSlack通知を行う

---

ルートユーザはAWSアカウントで全てのリソースに対して無制限の権限を持つ
認証情報が漏洩すると、リソースを不正利用されて多額の料金を請求される可能性がある
使用された場合に検知できるように設定をする

---

### 利用技術

- Slack
- AWS User Notifications
- CloudTrail
- S3

---

### Slack通知設定

Amazon Q Developer in chat applicationsで設定する
メールでもアプリのPush通知でも良い

---

### CloudTrailの確認

- バージニア北部にイベントログが保存されることを確認
- 証跡作成を忘れないこと
- 証跡を作成しないと通知されない
- S3に保存してライフサイクルルールでオブジェクトが1日で削除する設定にするとコスト面で安心

---

### AWS User Notificationsの設定

- AWS のサービスの名前: AWS Console Sign-in
- イベントタイプ: サインインイベント
- リージョン: US East (N. Virginia)
- 高度なフィルター(オプション):

```
{
  "detail": {
    "userIdentity": {
      "type": [
        "Root"
      ]
    }
  }
}
```

- 集約設定: どれでも良い
- 配信チャネル: どれでも良い

---

### ルートユーザでアクセスしてみる

- 通知されることを確認

---

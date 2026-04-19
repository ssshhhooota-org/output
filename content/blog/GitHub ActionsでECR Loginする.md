---
created: 2025/12/24 22:42
updated: 2026/04/08 23:43
public: true
tags:
thumbnail: "[[019c051f-2c47-7138-91ea-554881d74741.png]]"
title: GitHub ActionsでECR Loginする
---

## 手順

1. IDプロバイダの作成
   - プロバイダのタイプ: `OpenID Connect`
   - プロバイダのURL: `https://token.actions.githubusercontent.com`
   - 対象者: `sts.amazonaws.com`
2. ロールの作成
   - 信頼されたエンティティタイプ: `ウェブアイデンティティ`
   - アイデンティティプロバイダー: `token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
   - GitHub organization: `対象のorg`
   - GitHub repository: `対象のrepo`
   - GitHub branch: `対象のbranch`
   - 信頼関係
     https://github.com/aws-actions/configure-aws-credentials 参照
   - ポリシー
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "AllowPush",
           "Effect": "Allow",
           "Action": ["ecr:GetAuthorizationToken"],
           "Resource": "*"
         }
       ]
     }
     ```
3. GitHub Actionsの設定

```yml:.github/workflows/test-ecr-login.yml
name: Test ECR Login

on: [workflow_dispatch] # 手動実行

permissions:
  id-token: write

jobs:
  test-login:
    runs-on: ubuntu-latest
    environment:
      name: development
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@61815dcd50bd041e203e49132bacad1fd04d2708
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Verify login
        run: |
          echo "Registry: ${{ steps.login-ecr.outputs.registry }}"
          docker info | grep "Username\|Registry"
          echo "Login successful if no error above"


```

---
created: 2026/03/17 22:23
updated: 2026/04/08 23:48
public: true
tags:
  - ClaudeCode
---

# Claude CodeにPRのレビューをしてもらう

## 実現方法

1. 公式のGitHub Actionsを利用した自動レビュー・自動投稿
2. anthoropic公式のclaude-plugins-official(code-review:code-review)とgh commentを利用した自動レビュー・手動投稿

## 1. 公式のGitHub Actionsを利用した自動レビュー・自動投稿

https://code.claude.com/docs/ja/github-actions

公式サイト通りにセットアップすれば、git push時などのタイミングで自動レビューが行える

bot commentのため、authorがclaude codeになったと思う

文言修正や軽微な修正の場合に、token消費やCIに時間がかかるデメリットもあり、不採用とした

## 2. anthoropics公式のclaude-plugins-official(code-review:code-review)を利用した自動レビュー・手動投稿

https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review

PRを作成して、claude codeに `/code-review:code-review` と伝えるだけ  
レビューしてもらいたいPRのブランチと同ブランチにチェックアウトしておく必要はある  
任意のタイミングでレビューしてもらえるので不要なToken消費を避けれる  
commentのauthorは自分となる  
`gh comment` をclaude codeのpermissionsのaskに設定しているので、comment前に内容が確認できる  
「approveして問題ないです」のみの回答の場合は投稿せず、Ctrl + Cで終了している

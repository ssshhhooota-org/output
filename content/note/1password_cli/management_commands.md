---
created: 2026/04/18 16:25
updated: 2026/04/19 17:12
tags:
  - 1password cli
title: management commands
---

`op -h` のManagement Commands

see: https://developer.1password.com/docs/cli/reference/management-commands

## account
アカウント情報の操作が可能

`op account list`: アカウント一覧の取得

## connect
CI/CDでシークレット取得したり、API経由でシークレット参照が可能
サーバーの管理が必要

## document
ファイル操作が可能  
ファイルストレージとして利用する  
pemファイルなどを保存できるのは便利そう

`op document list`

## events-api
アカウントのアクティビティログを取得する  
ビジネスプラン以上が必要

## group
ユーザをまとめてVaultへのアクセス権限を管理する  
ビジネスプラン以上が必要

## item
保存したアイテム操作を行う  

`op item list`
`op item list --vault "開発"`
`op item get "Gmail"`
`op item create --categories login --title "" --vault "" --url "" -- username= password=`

## plugin
プラグイン操作

`op plugin list`

## service-account
CI/CDやサーバーなどでシークレットにアクセスするためのもの
op connectとは異なる

## user
ユーザー管理

`op user list`

## vault
保管庫の管理

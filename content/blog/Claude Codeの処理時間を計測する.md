---
created: 2026/02/05 22:55
updated: 2026/03/23 23:32
public: true
tags:
  - claudecode
---

# Claude Codeの処理時間を計測する

## なぜ独自に計測するのか

Claude Codeには `~/.claude/stats-cache.json` に利用統計が記録されているが、**各ターンの処理時間（何秒かかったか）は記録されない**。

| 既存機能で取れる | 既存機能で取れない       |
| ---------------- | ------------------------ |
| 日別メッセージ数 | ターンごとの処理時間     |
| セッション数     | 応答にかかった秒数       |
| トークン使用量   | プロジェクト別の作業時間 |

hooksを使って「プロンプト送信〜応答完了」の処理時間を計測する。

## セットアップ

### 1. hooksディレクトリを作成

```sh
mkdir -p ~/.claude/hooks
```

### 2. 開始時刻を記録するスクリプトを作成

```sh:~/.claude/hooks/track-turn-start.sh
#!/bin/bash
LOG_FILE="${HOME}/.claude/usage-log.jsonl"
STATE_FILE="${HOME}/.claude/.turn-state"
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CWD=$(echo "$INPUT" | jq -r '.cwd')
TIMESTAMP=$(date +%s)

# 状態ファイルに開始時刻を保存
echo "$TIMESTAMP" > "$STATE_FILE"

jq -n \
  --arg event "turn_start" \
  --arg session_id "$SESSION_ID" \
  --arg cwd "$CWD" \
  --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '$ARGS.named' >> "$LOG_FILE"
```

### 3. 終了時刻と処理時間を記録するスクリプトを作成

```sh:~/.claude/hooks/track-turn-end.sh
#!/bin/bash
LOG_FILE="${HOME}/.claude/usage-log.jsonl"
STATE_FILE="${HOME}/.claude/.turn-state"
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CWD=$(echo "$INPUT" | jq -r '.cwd')
END_TIMESTAMP=$(date +%s)

# 開始時刻を読み込んで処理時間を計算
if [ -f "$STATE_FILE" ]; then
  START_TIMESTAMP=$(cat "$STATE_FILE")
  DURATION=$((END_TIMESTAMP - START_TIMESTAMP))
  rm -f "$STATE_FILE"
else
  DURATION=0
fi

jq -n \
  --arg event "turn_end" \
  --arg session_id "$SESSION_ID" \
  --arg cwd "$CWD" \
  --argjson duration "$DURATION" \
  --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '$ARGS.named' >> "$LOG_FILE"
```

### 4. 実行権限を付与

```sh
chmod +x ~/.claude/hooks/track-turn-start.sh ~/.claude/hooks/track-turn-end.sh
```

### 5. settings.jsonにhooksを追加

`~/.claude/settings.json` に以下を追加（既存の設定がある場合はマージ）：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/track-turn-start.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/track-turn-end.sh"
          }
        ]
      }
    ]
  }
}
```

### 6. Claude Codeを再起動

設定を反映するためにClaude Codeを再起動する。

## 動作確認

```sh
tail -f ~/.claude/usage-log.jsonl
```

## ログ出力例

```jsonl
{"event":"turn_start","session_id":"abc123","cwd":"/Users/user/project","timestamp":"2026-02-05T14:00:00Z"}
{"event":"turn_end","session_id":"abc123","cwd":"/Users/user/project","duration":45,"timestamp":"2026-02-05T14:00:45Z"}
```

## 処理時間の集計

合計処理時間（秒）：

```sh
cat ~/.claude/usage-log.jsonl | jq -s '[.[] | select(.event == "turn_end")] | map(.duration) | add'
```

プロジェクト別の処理時間：

```sh
cat ~/.claude/usage-log.jsonl | jq -s '
  [.[] | select(.event == "turn_end")] |
  group_by(.cwd) |
  map({cwd: .[0].cwd, total_seconds: (map(.duration) | add), total_minutes: ((map(.duration) | add) / 60 | floor)}) |
  sort_by(-.total_seconds)
'
```

日別の処理時間：

```sh
cat ~/.claude/usage-log.jsonl | jq -s '
  [.[] | select(.event == "turn_end")] |
  group_by(.timestamp | split("T")[0]) |
  map({date: .[0].timestamp | split("T")[0], total_seconds: (map(.duration) | add), total_minutes: ((map(.duration) | add) / 60 | floor)}) |
  sort_by(.date)
'
```

## 制限事項

- **ユーザー入力待ち時間は含まれない**：`UserPromptSubmit` から `Stop` までの時間なので、Claudeが質問して回答を待っている時間は次のターンとして計測される
- **中断時のズレ**：Ctrl+Cで中断した場合、`Stop` フックが発火しない
- Claude Codeの処理速度はAPIのレイテンシ、サーバー負荷、ネットワーク状況に大きく左右される

## Claude Flow セットアップ手順

- バージョン: v2.7.0-alpha.10 以降
- 目的: DDD/Clean Architecture を維持したまま Claude Flow を導入する

### 1. インストール

```bash
npm install -D claude-flow@alpha agentdb@1.3.9
```

### 2. 初期化（既存 .claude を保持）

```bash
npx claude-flow@alpha init --force --preserve-claude-dir
```

### 3. MCP サーバー登録

```bash
claude mcp add claude-flow "npx claude-flow@alpha mcp start"
```

### 4. 設定ファイル

- `.flowconfig.json`: メモリ命名空間と Swarm ディレクトリを定義
- `.mcp.json`: `claude-flow` MCP サーバーを登録
- `.gitignore`: `.swarm/` を除外しつつ `config.json`・`hive-config.json` は追跡
- `.swarm/config.json`: ReasoningBank/AgentDB 用パスとログ/セッション配置

### 5. 動作確認

```bash
npx claude-flow@alpha --version
npx claude-flow@alpha memory status --reasoningbank
npx claude-flow@alpha memory agentdb-info
```

### 6. DDD レイヤ命名空間

- `domain`, `application`, `infrastructure`, `interface`, `architecture`
- 既定 namespace: `architecture`

### 7. 参考

- `FLOW.md`: Swarm ロール、スキル、トリガー
- `docs/memory-namespaces.md`: メモリ命名空間の運用
- `.claude/skills/*`: DDD 向けスキル定義

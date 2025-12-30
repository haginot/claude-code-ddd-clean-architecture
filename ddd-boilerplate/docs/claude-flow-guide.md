## Claude Flow ガイド

### 1. インストール & 初期化
- `npm install -D claude-flow@alpha agentdb@1.3.9`
- `npx claude-flow@alpha init --force --preserve-claude-dir`
- MCP 登録: `claude mcp add claude-flow "npx claude-flow@alpha mcp start"`

### 2. クイックスタート: 初めての DDD エンティティ
1. 「User エンティティを作って」と伝える
2. `ddd-entity-builder` スキルが発火し、Entity/VO/Factory/テストを生成
3. `architecture-guardian` がレイヤ違反を検証
4. 生成結果をレビューし、必要に応じて修正

### 3. スキル一覧
- `ddd-entity-builder`: エンティティ/集約/VO 生成＋不変条件＋イベント＋テスト
- `repository-generator`: ドメイン IF とインフラ実装、マッパー、統合テスト
- `domain-event-publisher`: イベントクラスと発火ロジック、ハンドラ足場
- `architecture-guardian`: レイヤ依存チェックと修正提案

### 4. メモリの使い方
- ReasoningBank（`.swarm/memory.db`）: パターン/決定の永続化
- AgentDB: ベクタ検索で類似エンティティ/設計を再利用
- 既定 namespace: `architecture`
- 命名空間の詳細: `docs/memory-namespaces.md`

### 5. Swarm / Hive-Mind
- Queen: `strategic-coordinator`
- Workers: `domain-expert`, `application-architect`, `infrastructure-engineer`, `test-engineer`
- 設定: `.swarm/hive-config.json`
- 長期作業は `.swarm/sessions` で継続

### 6. GitHub 連携
- `.github/workflows/claude-flow-review.yml`: PR の DDD/レイヤ検証
- `.github/workflows/ai-quality-check.yml`: テスト・ベンチ・クオリティゲート

### 7. トラブルシュート
- `npx claude-flow@alpha --version` で CLI 確認
- ベクタ検索が 0 件: `npx claude-flow@alpha memory agentdb-info` を確認
- レイヤ違反検出: `npx claude-flow@alpha validate-architecture --strict`

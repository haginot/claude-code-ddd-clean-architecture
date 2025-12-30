## Claude Flow メモリ命名空間運用

### 命名空間
- `domain`: エンティティ / VO / 集約 / ドメインイベント
- `application`: ユースケース / コマンド / クエリ
- `infrastructure`: リポジトリ実装 / マッパー / 外部連携
- `interface`: コントローラ / DTO / API
- `architecture`: レイヤ決定 / パターン適用履歴 / 逸脱

### 利用例
```bash
# 設計決定を保存 (ReasoningBank)
npx claude-flow@alpha memory store \
  order_aggregate_created \
  "OrderAggregate manages OrderItems; total must be >= 0" \
  --namespace domain \
  --reasoningbank

# ベクタ検索 (AgentDB)
npx claude-flow@alpha memory store-vector \
  entity_user \
  "User aggregate with EmailAddress value object, validates invariants" \
  --namespace domain \
  --metadata '{"context":"user-management","pattern":"aggregate-root"}'

npx claude-flow@alpha memory vector-search \
  "entity with email validation" \
  --namespace domain \
  --k 5 \
  --threshold 0.7
```

### 運用ポリシー
- 既定 namespace: `architecture`（重要決定を集約）
- 大きなリファクタ前に `architecture` に決定を保存し、Swarm/Skill が参照できるようにする
- 新規 bounded context は `sessions` で管理し、継続作業に備える

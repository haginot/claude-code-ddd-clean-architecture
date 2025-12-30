## AI 支援への移行ガイド

### フェーズ 1: パッシブ学習 (Week 1-2)
- Claude Flow を導入し、既存コードを観測
- メモリに現状のパターンを保存（`architecture` namespace）
- リスク: なし（読み取りのみ）

### フェーズ 2: レビュー支援 (Week 3-4)
- `architecture-guardian` で PR をチェック
- 人が最終判断を行い、修正案を参照
- リスク: 低（人レビュー前提）

### フェーズ 3: ボイラープレート生成 (Week 5-6)
- `ddd-entity-builder` / `repository-generator` / `domain-event-publisher` を有効化
- 生成物は必ずレビューする
- リスク: 中（レビュー負荷を確保）

### フェーズ 4: 協働開発 (Week 7+)
- Hive-Mind/Swarm で bounded context 作成を自動化
- AgentDB/ReasoningBank から過去決定を再利用
- リスク: 中（チームでルールを共有）

### トレーニング
- スキルごとのデモを週次で実施
- `docs/claude-flow-guide.md` を読み合わせ
- 代表者がパターン/命名のレビューをリード

### よくある懸念への回答
- **レイヤ違反**: `architecture-guardian` と CI で自動検出
- **パターンのばらつき**: AgentDB/ReasoningBank に成功例を蓄積し提案に反映
- **学習コスト**: フェーズを分けて漸進導入

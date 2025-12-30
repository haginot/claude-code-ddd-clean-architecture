## Skill: ddd-entity-builder

- **目的**: DDD エンティティ/集約/VO を戦術パターンに沿って生成
- **トリガー**: 「create entity」「build aggregate」「エンティティを作って」
- **入力**: エンティティ名、属性、不変条件、発火するドメインイベント
- **出力**: Entity クラス（`Entity<T>` / `AggregateRoot<T>` 継承）、VO、Factory、テスト

### ワークフロー
1. **ドメイン分析**: 不変条件・ドメインイベント・境界を確認し、必要な VO を列挙
2. **コード生成**:
   - Entity/Aggregate を生成（ID、状態、振る舞い、イベント発火を含む）
   - VO を immutable + バリデーション付きで生成
   - Factory メソッド (`static create`) を追加
3. **テスト生成**:
   - 不変条件のテスト
   - Factory 成功/失敗ケース
   - ドメインイベント発火の検証
4. **アーキ検証**: `architecture-guardian` によるレイヤ違反チェック
5. **メモリ保存**: AgentDB/ReasoningBank にパターンを `namespace=domain` で保存し、bounded context を metadata に付与

### 参考コマンド
```bash
npx claude-flow@alpha memory store-vector \
  entity_user \
  "User aggregate with EmailAddress VO; invariants validated" \
  --namespace domain \
  --metadata '{"context":"user","pattern":"aggregate-root"}'
```

## Skill: repository-generator

- **目的**: ドメイン層の Repository IF とインフラ実装、マッパー、統合テストを生成
- **トリガー**: 「create repository」「implement persistence」「リポジトリを作って」
- **前提**: `src/shared/domain/Repository.ts` を基底インターフェイスとする

### ワークフロー
1. **IF 生成**: ドメイン層に Repository インターフェイスを生成（型はドメイン型のみ）
2. **実装生成**: infrastructure 層に永続化実装を配置（DB/外部サービス依存）
3. **マッパー生成**: Domain ↔ Persistence の相互変換クラスを生成
4. **テスト生成**: 統合テストを作成し、CRUD と不変条件を検証
5. **アーキ検証**: `architecture-guardian` でレイヤ違反がないかチェック
6. **メモリ保存**: AgentDB にリポジトリパターンを `namespace=infrastructure` で保存

### 生成例（概要）
- `domain/UserRepository.ts`: `UserRepository extends Repository<User>`
- `infrastructure/PostgresUserRepository.ts`: DB 依存の実装
- `infrastructure/mappers/UserMapper.ts`: `toDomain` / `toPersistence`

# Claude Flow ガイド (DDD Boilerplate)

## 1. Swarm エージェント構成
- **Domain Expert Agent**: エンティティ/VO/集約境界の提案・生成
- **Architecture Guardian Agent**: レイヤ依存の検証と修正案提示
- **Test Engineer Agent**: 不変条件・イベント・リポジトリのテスト生成
- **Repository Specialist Agent**: リポジトリ実装とマッパー生成

## 2. メモリ命名空間
- `domain`: エンティティ、VO、集約、ドメインイベント
- `application`: ユースケース、コマンド、クエリ
- `infrastructure`: リポジトリ実装、マッパー、外部サービス
- `interface`: コントローラ、DTO、API
- `architecture`: レイヤ決定、パターン適用履歴
- `tasks`: Task Master タスク情報、進捗状況

## 3. 推奨スキルと役割
- `ddd-entity-builder`: エンティティ/集約/VO の生成と不変条件整理
- `repository-generator`: ドメインIF＋インフラ実装＋マッパー
- `domain-event-publisher`: ドメインイベント生成と発火組み込み
- `architecture-guardian`: レイヤ違反検出と修正ガイド
- `task-management`: Task Master を使用したタスク管理

## 4. ナチュラルランゲージ・トリガー例
- 「ユーザ集約を作って」「Order aggregate を生成して」
- 「リポジトリを実装して」「永続化コードを書いて」
- 「ドメインイベントを発火して」「OrderPlaced を追加して」
- 「アーキテクチャを検証して」「依存違反をチェックして」
- 「PRDをパースして」「次のタスクは何？」

## 5. 既存 CLAUDE.md との連携
- CLAUDE.md のガードレール（レイヤ境界/命名）を維持しつつ、Claude Flow スキルで DDD ボイラープレート生成を高速化。
- メモリへの格納時は `architecture` namespace を既定とし、重要決定事項を AgentDB/ReasoningBank に保存。

## 6. Hive-Mind / Swarm 運用
- `.swarm/hive-config.json` を参照し、Queen が Domain/Architecture/Test 各エージェントを調整。
- セッションは `.swarm/sessions` に保存し、長期の境界づくりに再利用。

## 7. 参考
- `docs/claude-flow-setup.md`
- `docs/memory-namespaces.md`
- `.claude/skills/*`

---

## Task Master Flow 統合

### 概要
Task Master と Claude Flow の統合により、タスクライフサイクルの自動化が可能です。

### 自動化ワークフロー

#### タスク作成フロー
1. PRD が更新される → タスク再生成がトリガー
2. タスクがアーキテクチャルールに対して検証される
3. 複雑さ分析が実行される
4. チームに新しいタスクが通知される

#### 実装フロー
1. 開発者がタスクを開始 → フィーチャーブランチが作成される
2. レイヤーに基づいてテスト構造が生成される
3. 実装ガイダンスが提供される
4. アーキテクチャが継続的に検証される
5. タスクステータスが自動更新される

#### 完了フロー
1. コードがコミットされる → アーキテクチャ検証が実行
2. テストが自動実行される
3. タスクがレビュー準備完了としてマークされる
4. タスク参照付きでPRが作成される

### トリガー設定

```json
{
  "triggers": {
    "on_task_created": ["validate_task_against_architecture"],
    "on_task_started": ["checkout_feature_branch", "setup_test_structure"],
    "on_task_completed": ["run_architecture_validation", "run_tests"],
    "on_prd_updated": ["regenerate_tasks", "update_complexity_report"]
  }
}
```

### タスク実装ワークフロー

1. **タスク要件の解析** - タスクが何を必要としているかを理解
2. **影響レイヤーの特定** - 関係するDDDレイヤーを決定
3. **ドメインロジックの実装** - まずドメインレイヤー（エンティティ、VO、イベント）
4. **アプリケーションロジックの実装** - ユースケースとハンドラー
5. **インフラストラクチャの実装** - リポジトリ実装、外部サービス
6. **インターフェースの実装** - コントローラ、APIエンドポイント
7. **アーキテクチャ検証** - `npm run validate:layers`
8. **テスト実行** - `npm test`
9. **タスクステータス更新** - 完了としてマーク

### 設定ファイル
詳細な設定は `.flowconfig.json` を参照してください。

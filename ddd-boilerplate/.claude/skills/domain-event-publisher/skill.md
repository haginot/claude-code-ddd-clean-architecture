## Skill: domain-event-publisher

- **目的**: ドメインイベントの定義・発火・ハンドラ足場を生成
- **トリガー**: 「create domain event」「publish event」「ドメインイベントを追加」
- **命名規約**: `{EntityName}{PastTenseVerb}` 例: `OrderPlaced`

### ワークフロー
1. **イベント定義**: `DomainEvent` を実装したクラスを生成（`occurredAt`, `aggregateId` を含む）
2. **発火組み込み**: Aggregate のメソッドに `addDomainEvent(new Event(...))` を挿入
3. **ハンドラ足場**: application 層にイベントハンドラのスケルトンを生成
4. **テスト生成**: 発火・ハンドラ呼び出し・ペイロード検証のテストを生成
5. **メモリ保存**: イベントパターンを `namespace=domain` に保存し、bounded context を metadata に付与

### 生成例（概要）
- `domain/events/OrderPlaced.ts`: `DomainEvent` 実装
- `domain/Order.ts`: `this.addDomainEvent(new OrderPlaced(...))`
- `application/events/handlers/OnOrderPlaced.ts`: ハンドラ足場

## Skill: architecture-guardian

- **目的**: レイヤ依存・命名・責務分離の検証と修正提案
- **トリガー**: 「validate architecture」「check dependencies」「依存違反をチェック」
- **検証ルール**:
  - Domain 層は application/infrastructure/interface を import しない
  - Repository IF は domain、実装は infrastructure
  - DTO は application/interface のみに配置
  - テスト内のモジュール境界違反を検知

### ワークフロー
1. 変更差分を解析し、違反候補を抽出
2. 違反箇所と根拠をレポート（ファイル/シンボル単位）
3. 修正案を提示し、必要に応じて自動修正パッチを提案
4. 結果を `namespace=architecture` に保存し、再利用

### 参考コマンド
```bash
npx claude-flow@alpha validate-architecture --strict
```

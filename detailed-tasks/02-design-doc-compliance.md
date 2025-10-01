# タスク2: Design-doc.md 準拠性チェック

## 概要
Design-doc.mdで定義された仕様と現在の実装を詳細に比較し、差異を特定・修正する。

## チェック項目

### 1. 画面仕様準拠性

#### 1.1 ログイン画面 (Login)
**Design-doc 要求事項:**
- ユーザーID・パスワード入力
- ログイン処理
- パスワード表示/非表示切り替え
- エラーメッセージ表示

**現在の実装確認:**
- [x] ユーザーID・パスワード入力 ✅
- [x] ログイン処理（Firebase Auth） ✅  
- [x] パスワード表示/非表示切り替え ✅
- [x] エラーメッセージ表示 ✅

**状態管理準拠性:**
```typescript
// Design-doc 要求
const [userid, setUserId] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

// 実装確認: ✅ 準拠
```

#### 1.2 イベント一覧画面 (EventList)
**Design-doc 要求事項:**
- 受付可能イベント一覧表示
- イベント検索・フィルタリング
- ページネーション
- ソート機能（最終更新日順）
- ログアウト機能

**現在の実装確認項目:**
- [ ] イベント一覧表示の確認
- [ ] 検索・フィルタリング機能の確認
- [ ] ページネーション実装の確認
- [ ] ソート機能の確認
- [ ] ログアウト機能の確認

#### 1.3 受付方法選択画面 (SelectReceptionMethod)
**Design-doc 要求事項:**
- 受付方法の選択（QRコード/手動入力）
- プライバシー同意確認
- 管理者画面への遷移

**チェック項目:**
- [ ] QRコード受付ボタンの実装確認
- [ ] 手動入力受付ボタンの実装確認
- [ ] プライバシー同意モーダルの実装確認
- [ ] 管理者メニューの実装確認

#### 1.4 プライバシー同意画面 (PrivacyConsent)
**Design-doc 要求事項:**
- プライバシーポリシー内容表示
- 同意・非同意選択
- スクロール可能なプライバシー内容

#### 1.5 QR受付説明画面 (SelfqrDescription)
**Design-doc 要求事項:**
- QRコード受付の使用方法説明
- カルーセル形式での手順表示（3つのスライド）
- QRスキャナーへの遷移

#### 1.6 QRスキャナー画面 (SelfqrScanner)
**Design-doc 要求事項:**
- QRコードスキャン機能
- カメラ権限要求
- QRコード読み取り処理

#### 1.7 チェックイン画面 (CheckIn)
**Design-doc 要求事項:**
- 参加者情報の手動入力
- フォームバリデーション
- 住所自動補完（郵便番号から）

#### 1.8 チェックイン確認画面 (CheckInConfirmation)
**Design-doc 要求事項:**
- 入力された情報の確認表示
- "受付する"ボタン
- "編集する"ボタン

#### 1.9 完了画面 (Completion)
**Design-doc 要求事項:**
- 受付完了メッセージ表示
- 自動的に最初の画面に戻る（10秒カウントダウン）
- ダイアログモーダル
- 成功アイコン

### 2. ナビゲーションフロー準拠性

#### 2.1 基本フロー確認
```
Login → EventList → SelectReceptionMethod → (QR or Manual)
```

#### 2.2 QRフロー確認
```
SelectReceptionMethod → PrivacyConsent → SelfqrDescription → SelfqrScanner → CheckInConfirmation → Completion → Login
```

#### 2.3 手動入力フロー確認
```
SelectReceptionMethod → PrivacyConsent → CheckIn → CheckInConfirmation → Completion → Login
```

### 3. コンポーネント仕様準拠性

#### 3.1 Headerコンポーネント
**Design-doc 定義:**
```typescript
type HeaderProps = {
  titleName: string;
  buttonName: string;
  buttonWidth?: number;
  icon?: React.ReactNode;
  iconPosition?: string;
  onPress?: () => void;
  hasButton?: boolean;
}
```

#### 3.2 Buttonコンポーネント
**Design-doc 定義:**
```typescript
type ButtonProps = {
  onPress?: () => void;
  text: string;
  type?: "ButtonMPrimary" | "ButtonLGray" | "ButtonSPrimary" | ...; // 8種類のスタイル
  style?: ViewStyle;
  icon?: React.ReactNode;
  iconPosition?: "front" | "behind" | "center";
  buttonWidth?: number;
}
```

### 4. 状態管理パターン準拠性

#### 4.1 基本パターン確認
```typescript
// 各画面での基本パターン
const [loading, setLoading] = useState(true);
const [data, setData] = useState<any[]>([]);
const [error, setError] = useState("");
const [isModalVisible, setModalVisible] = useState(false);
const [inputValue, setInputValue] = useState("");
```

#### 4.2 ナビゲーション間データ受け渡し
```typescript
// 送信側
navigation.navigate("TargetScreen", { params: paramObject });

// 受信側
const route = useRoute();
const { params } = route.params as ParamsType;
```

### 5. スタイルシステム準拠性

#### 5.1 カラーパレット確認
```typescript
colors = {
  primary: "rgba(52, 109, 244, 1)",      // メインブルー
  secondary: "rgba(255, 255, 255, 1)",    // ホワイト
  danger: "rgba(233, 12, 12, 1)",         // エラーレッド
  textColor: "rgba(30, 33, 41, 1)",       // メインテキスト
  greyTextColor: "rgba(81, 88, 103, 1)",  // サブテキスト
  borderColor: "rgba(184, 188, 199, 1)",  // ボーダー
  greyContainerColor: "#EEEFF0",          // 背景グレー
}
```

#### 5.2 タイポグラフィ確認
- HeadingLargeBold: 36px/50px line-height, weight 600
- HeadingSmallBold: 28px/42px line-height, weight 600
- ButtonMediumBold: ボタン用フォント

## 実装作業

### Phase 1: 画面仕様チェック (3日)
1. 各画面のUI要素を Design-doc と照合
2. 不足している要素の特定
3. 状態管理パターンの統一

### Phase 2: ナビゲーション修正 (2日)
1. ナビゲーションフローの確認
2. パラメータ受け渡しの修正
3. 画面遷移アニメーションの確認

### Phase 3: コンポーネント統一 (2日)
1. 基本コンポーネントの props 統一
2. スタイルシステムの完全適用
3. レスポンシブ対応の確認

## 検証方法
1. 各画面を Design-doc の仕様書と照合
2. 全画面のナビゲーションフローをテスト
3. UI要素の表示・動作確認
4. 状態管理の動作確認

## 成果物
- [ ] 仕様準拠チェックリスト
- [ ] 発見された差異の一覧
- [ ] 修正実装
- [ ] テストケース

## 所要時間
約7日

## 前提条件
- タスク1（TypeScript修正）完了後に実施
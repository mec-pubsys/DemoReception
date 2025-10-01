# DemoReception フロントエンド仕様書 (Design-doc.md)

## 概要

DemoReceptionは、React Native/Expoで構築された受付システムのフロントエンドアプリケーションです。イベント受付業務を効率化するためのモバイル対応アプリケーションです。

## アーキテクチャ

### 技術スタック
- **フレームワーク**: React Native 0.72.10 + Expo 49.0.15
- **ナビゲーション**: React Navigation (Native Stack Navigator)
- **状態管理**: React Hooks (useState, useEffect)
- **スタイリング**: StyleSheet + React Native Responsive Screen
- **フォント**: Hiragino Kaku Gothic Pro (日本語対応)
- **アイコン**: Expo Vector Icons (@expo/vector-icons)

### プロジェクト構造
```
example/
├── App.tsx                    # メインアプリケーション・ナビゲーション設定
├── src/
│   ├── screens/              # 画面コンポーネント
│   ├── components/           # 再利用可能なコンポーネント
│   ├── styles/              # スタイル定義
│   ├── models/              # データモデル
│   ├── assets/              # 画像・フォントリソース
│   └── config/              # 設定ファイル
```

## スタイルシステム

### カラーパレット
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

### タイポグラフィシステム
- **HeadingLargeBold**: 36px/50px line-height, weight 600
- **HeadingSmallBold**: 28px/42px line-height, weight 600
- **ButtonMediumBold**: ボタン用フォント
- **BodyTextLarge**: 本文用フォント
- **LabelLargeBold**: ラベル用フォント

### レスポンシブデザイン
- `react-native-responsive-screen`を使用
- `widthPercentageToDP (wp)` と `heightPercentageToDP (hp)` でレスポンシブ対応

## コンポーネントシステム

### 基本コンポーネント

#### Header
**場所**: `src/components/basics/header.tsx`
```typescript
type HeaderProps = {
  titleName: string;           // ヘッダータイトル
  buttonName: string;          // ボタンテキスト
  buttonWidth?: number;        // ボタン幅
  icon?: React.ReactNode;      // アイコン
  iconPosition?: string;       // アイコン位置
  onPress?: () => void;        // ボタン押下時の処理
  hasButton?: boolean;         // ボタン表示フラグ
}
```

#### Button
**場所**: `src/components/basics/Button.tsx`
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

#### Dialog
**場所**: `src/components/basics/Dialog.tsx`
- モーダルダイアログコンポーネント
- プライバシー同意、確認画面で使用

#### CustomCalendar
**場所**: `src/components/basics/Calendar.tsx`
- カスタムカレンダーコンポーネント
- 日付選択機能

### スタイル化テキストコンポーネント
**場所**: `src/components/StyledText.tsx`
- `HiraginoKakuText`: 日本語フォント適用済みテキストコンポーネント

## 画面構成・ナビゲーションフロー

### 1. ログイン画面 (Login)
**場所**: `src/screens/login/Login.tsx`

**機能**:
- ユーザーID・パスワード入力
- ログイン処理
- パスワード表示/非表示切り替え
- エラーメッセージ表示

**UIコンポーネント**:
- ヘッダー: "受付システム"
- 入力フィールド: ユーザーID、パスワード
- ログインボタン
- エラーメッセージ表示エリア

**状態管理**:
```typescript
const [userid, setUserId] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
```

**ナビゲーション**: ログイン成功時 → EventList画面

### 2. イベント一覧画面 (EventList)
**場所**: `src/screens/event-list/EventList.tsx`

**機能**:
- 受付可能イベント一覧表示
- イベント検索・フィルタリング
- ページネーション
- ソート機能（最終更新日順）
- ログアウト機能

**UIコンポーネント**:
- ヘッダー: "受付するイベントを選んでください" + ログアウトボタン
- 検索フィールド群（イベント名、開催日期間）
- ソート選択ドロップダウン
- イベントリスト
- ページネーションボタン

**状態管理**:
```typescript
const [events, setEvents] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [showInputs, setShowInputs] = useState(false);
const [selectedOption, setSelectedOption] = useState("最終更新日が新しい");
```

**ナビゲーション**: イベント選択時 → SelectReceptionMethod画面

### 3. 受付方法選択画面 (SelectReceptionMethod)
**場所**: `src/screens/select-reception-method/SelectReceptionMethod.tsx`

**機能**:
- 受付方法の選択（QRコード/手動入力）
- プライバシー同意確認
- 管理者画面への遷移

**UIコンポーネント**:
- ヘッダー: "受付" + 設定メニューボタン
- イベント名表示
- 受付方法選択ボタン（2つ）:
  - QRコード受付
  - 手動入力受付
- 管理者メニュー

**状態管理**:
```typescript
const [isMenuVisible, setMenuVisible] = useState(false);
const [isCertificationModalVisible, setCertificationModalVisible] = useState(false);
const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
const [eventName, setEventName] = useState("");
```

**ナビゲーション**:
- QR選択時 → プライバシー同意 → SelfqrDescription画面
- 手動入力選択時 → プライバシー同意 → CheckIn画面

### 4. プライバシー同意画面 (PrivacyConsent)
**場所**: `src/screens/privacy-consent/PrivacyConsent.tsx`

**機能**:
- プライバシーポリシー内容表示
- 同意・非同意選択

**UIコンポーネント**:
- ダイアログモーダル
- タイトル: "以下の内容に同意して受付を開始してください"
- スクロール可能なプライバシー内容
- "同意する"/"同意しない"ボタン

**状態管理**:
```typescript
const [scrollEnabled, setScrollEnabled] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(true);
```

### 5. QR受付説明画面 (SelfqrDescription)
**場所**: `src/screens/serlfqr-description/SelfqrDescription.tsx`

**機能**:
- QRコード受付の使用方法説明
- カルーセル形式での手順表示
- QRスキャナーへの遷移

**UIコンポーネント**:
- ヘッダー: "自己QRで受付" + "受付をやめる"ボタン
- カルーセル（3つのスライド）:
  1. "[自治体アプリ]を起動して、自己QRをタップ"
  2. "受付する人を選んで、自己QRを表示するをタップ"
  3. "自己QRが表示されます。読み取りへ進んでください"
- ページインジケーター
- "読み取りへ進む"ボタン

**状態管理**:
```typescript
const [currentIndex, setCurrentIndex] = useState<number>(0);
const flatListRef = useRef<FlatList<any> | null>(null);
```

**ナビゲーション**: 
- "読み取りへ進む" → SelfqrScanner画面
- "受付をやめる" → SelectReceptionMethod画面

### 6. QRスキャナー画面 (SelfqrScanner)
**場所**: `src/screens/selfqr-scanner/SelfqrScanner.tsx`

**機能**:
- QRコードスキャン機能
- カメラ権限要求
- QRコード読み取り処理

**UIコンポーネント**:
- ヘッダー: "自己QRをかざしてください" + "受付をやめる"ボタン
- カメラビュー
- スキャンエリア表示
- QRコード読み取り成功時のアラート

**状態管理**:
```typescript
const [hasPermission, setHasPermission] = useState<boolean | null>(null);
const [scanned, setScanned] = useState(false);
const [isScannerReady, setIsScannerReady] = useState<boolean>(false);
```

**ナビゲーション**:
- QR読み取り成功時 → CheckInConfirmation画面（予想）
- "受付をやめる" → SelectReceptionMethod画面

### 7. チェックイン画面 (CheckIn)
**場所**: `src/screens/check-in/CheckIn.tsx`

**機能**:
- 参加者情報の手動入力
- フォームバリデーション
- 住所自動補完（郵便番号から）

**UIコンポーネント**:
- 複数の入力フィールド
- カレンダー日付選択
- バリデーションエラー表示
- 次へ進むボタン

**状態管理**:
```typescript
const [selectedOption, setSelectedOption] = useState("");
// 各種入力フィールドの状態
```

**ナビゲーション**: 入力完了時 → CheckInConfirmation画面

### 8. チェックイン確認画面 (CheckInConfirmation)
**場所**: `src/screens/check-in-confirmation/CheckInConfirmation.tsx`

**機能**:
- 入力された情報の確認表示
- 受付処理の実行
- 完了画面への遷移

**UIコンポーネント**:
- 入力情報の確認表示
- "受付する"ボタン
- "編集する"ボタン

**状態管理**:
```typescript
const [isModalVisible, setModalVisible] = useState(false);
const [scrollEnabled, setScrollEnabled] = useState(false);
```

**ナビゲーション**:
- "受付する" → Completion画面
- "編集する" → CheckInEdit画面

### 9. 完了画面 (Completion)
**場所**: `src/screens/completion/Completion.tsx`

**機能**:
- 受付完了メッセージ表示
- 自動的に最初の画面に戻る（10秒カウントダウン）

**UIコンポーネント**:
- ダイアログモーダル
- 成功アイコン
- "受付が完了しました"メッセージ
- カウントダウン表示
- "最初の画面に戻る"ボタン

**状態管理**:
```typescript
const [seconds, setSeconds] = useState(10);
```

**ナビゲーション**: 自動的に最初の画面（Login）に戻る

## データモデル（フロントエンド）

### User
**場所**: `src/models/User.ts`
```typescript
export class User {
  private _userId: string = "";
  
  get userId(): string;
  set userId(value: string);
  clone(): User;
  getAllValuesAsString(): string;
}
```

### パラメータクラス群
各画面間でのデータ受け渡しに使用：
- `EventListParams`
- `SelectReceptionMethodParams`
- `SelfqrDescriptionParams`
- `CheckInParams`
- `CheckInConfirmationParams`

## 状態管理パターン

### 画面レベルの状態管理
各画面で`useState`を使用した局所的な状態管理：
```typescript
// 基本的なパターン
const [loading, setLoading] = useState(true);
const [data, setData] = useState<any[]>([]);
const [error, setError] = useState("");

// モーダル表示制御
const [isModalVisible, setModalVisible] = useState(false);

// フォーム入力制御
const [inputValue, setInputValue] = useState("");
```

### ナビゲーション間のデータ受け渡し
React Navigationのparamsを使用：
```typescript
// 送信側
navigation.navigate("TargetScreen", { params: paramObject });

// 受信側
const route = useRoute();
const { params } = route.params as ParamsType;
```

## ユーザーインタラクション

### 基本的なインタラクション
1. **タップ/プレス**: ボタン、リスト項目の選択
2. **テキスト入力**: フォームフィールドへの入力
3. **スワイプ/スクロール**: カルーセル、リスト、長いコンテンツ
4. **日付選択**: カスタムカレンダー
5. **QRスキャン**: カメラを使用したコード読み取り

### フィードバック
- **視覚的フィードバック**: ボタンの押下状態、ローディング表示
- **エラー表示**: バリデーションエラー、処理エラーメッセージ
- **成功表示**: 受付完了時のアイコンとメッセージ
- **カウントダウン表示**: 自動遷移の予告

## レイアウトパターン

### 共通レイアウト構造
```
SafeAreaView (メイン容器)
├── StatusBar (ステータスバー制御)
├── Header (ヘッダーコンポーネント)
├── View/ScrollView (メインコンテンツエリア)
└── Footer (必要に応じて)
```

### レスポンシブ対応
- コンテナの幅・高さは画面サイズに対する割合で指定
- フォントサイズは固定値とレスポンシブ値を組み合わせ
- 画像は`resizeMode`プロパティで適切な表示調整

## アニメーション・トランジション

### ナビゲーションアニメーション
```typescript
// App.tsxでのアニメーション設定
screenOptions={{
  headerShown: false,
  animation: "none",  // アニメーション無効化
}}
```

### カルーセルアニメーション
- `FlatList`の`pagingEnabled`を使用したページング
- `scrollToIndex`でプログラム制御

### カウントダウンアニメーション
- `setInterval`を使用した1秒間隔の更新

## パフォーマンス考慮事項

### 画像最適化
- 適切な解像度での画像配置
- PNG形式での透過画像使用

### メモリ管理
- `useEffect`のクリーンアップ関数でタイマー解除
- 不要なリスナーの適切な削除

### レンダリング最適化
- 必要最小限の状態更新
- 適切なキー属性の使用（リスト表示）

## セキュリティ考慮事項（フロントエンド）

### 入力検証
- フォームバリデーション実装
- 不正な文字入力の防止

### 機密情報の取り扱い
- パスワード入力時のマスク表示
- 画面キャプチャ時の機密情報保護

## 今後の拡張性

### コンポーネント拡張
- 基本コンポーネントの再利用性向上
- 新しいUIパターンの追加

### 国際化対応
- 多言語対応のためのi18n準備
- 日本語以外の言語サポート

### アクセシビリティ
- スクリーンリーダー対応
- キーボードナビゲーション対応

---

**注意**: この仕様書はフロントエンドの動作のみを記載しており、バックエンドとの通信やデータベース連携部分は除外しています。実際の実装時は、バックエンドAPIとの連携部分を別途設計・実装する必要があります。
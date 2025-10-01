# タスク1: TypeScript エラー修正

## 概要
現在のコードベースに存在するTypeScriptエラーを修正し、型安全性を向上させる。

## 発見されたエラー

### 1. Navigation Props 型エラー (App.tsx:81)
**エラー内容:**
```
Type '(props: PreVerificationProps) => React.JSX.Element' is not assignable to type 'ScreenComponentType<ParamListBase, "PreReceptionVerification"> | undefined'
```

**原因:** 
PreReceptionVerification コンポーネントが独自のProps型を要求しているが、React Navigationが期待する型と一致していない。

**修正方針:**
1. React Navigationの型定義に合わせてPropsを修正
2. パラメータ受け渡しはroute.paramsを使用するよう変更

### 2. 欠損依存関係エラー (ExternalLink.tsx)
**エラー内容:**
```
Cannot find module 'expo-router' or its corresponding type declarations.
Cannot find module 'expo-web-browser' or its corresponding type declarations.
```

**修正方針:**
1. 不要な依存関係を削除、または必要であれば追加インストール
2. ExternalLinkコンポーネントが実際に使用されているか確認
3. 未使用の場合は削除を検討

## 実装手順

### Step 1: Navigation Props 修正
```typescript
// Before (問題のあるコード)
type PreVerificationProps = {
  eventName: string;
  eventPeriod: string;
  venue: string;
  eventId: string;
  venueId: string;
};

// After (修正後)
type PreVerificationProps = {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
};

// パラメータアクセス方法
const { eventName, eventPeriod, venue, eventId, venueId } = route.params;
```

### Step 2: 依存関係整理
1. package.jsonの依存関係を確認
2. 不要なimportを削除
3. 必要に応じて依存関係を追加

### Step 3: 型安全性向上
```typescript
// ParamListの定義を追加
type RootStackParamList = {
  Login: undefined;
  EventList: EventListParams;
  SelectReceptionMethod: SelectReceptionMethodParams;
  PreReceptionVerification: {
    eventName: string;
    eventPeriod: string;
    venue: string;
    eventId: string;
    venueId: string;
  };
  // 他の画面のパラメータ定義...
};

// NavigationPropの型指定を改善
type Props = {
  navigation: NavigationProp<RootStackParamList, 'PreReceptionVerification'>;
  route: RouteProp<RootStackParamList, 'PreReceptionVerification'>;
};
```

## 検証方法
1. `npx tsc --noEmit` でTypeScriptエラーが0件になることを確認
2. 各画面のナビゲーションが正常に動作することを確認
3. パラメータ受け渡しが正常に動作することを確認

## 期待される効果
- TypeScriptエラー 0件
- 型安全なナビゲーション
- IDEでの適切な型補完
- ランタイムエラーの削減

## 所要時間
約1-2日

## 関連ファイル
- `App.tsx`
- `src/components/ExternalLink.tsx`
- `src/screens/pre-reception-verification/PreReceptionVerification.tsx`
- 各画面コンポーネントのProps定義
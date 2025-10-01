# タスク4: アクセシビリティ対応

## 概要
WCAG 2.1 AA準拠を目指し、視覚障害者・運動障害者・聴覚障害者を含む全てのユーザーが受付アプリを快適に利用できるよう改善する。

## アクセシビリティ要件

### 1. スクリーンリーダー対応

#### 1.1 音声読み上げラベル実装
**対象コンポーネント:**
- 全ボタン要素
- 入力フィールド
- 画像・アイコン
- ナビゲーション要素

**実装例:**
```typescript
// Before
<Button text="ログイン" onPress={handleLogin} />

// After
<Button 
  text="ログイン" 
  onPress={handleLogin}
  accessibilityLabel="ログインボタン"
  accessibilityHint="タップすると受付システムにログインします"
  accessibilityRole="button"
/>
```

#### 1.2 画面コンテンツの論理的読み上げ順序
```typescript
// Header要素
<Header 
  accessibilityLabel="受付システム ヘッダー"
  accessibilityRole="header"
/>

// メインコンテンツ
<View accessibilityRole="main">
  {/* フォーム要素 */}
  <TextInput
    accessibilityLabel="ユーザーID入力欄"
    accessibilityHint="受付担当者のIDを入力してください"
    placeholder="ユーザーID"
  />
  
  <TextInput
    accessibilityLabel="パスワード入力欄"
    accessibilityHint="パスワードを入力してください"
    placeholder="パスワード"
    secureTextEntry={!showPassword}
  />
</View>
```

#### 1.3 動的コンテンツの音声通知
```typescript
// エラーメッセージの音声通知
const [errorMessage, setErrorMessage] = useState("");
const [announceError, setAnnounceError] = useState("");

useEffect(() => {
  if (errorMessage) {
    setAnnounceError(`エラーが発生しました: ${errorMessage}`);
  }
}, [errorMessage]);

return (
  <View>
    {announceError && (
      <Text
        accessibilityLiveRegion="polite"
        accessibilityLabel={announceError}
        style={{ position: 'absolute', left: -10000 }}
      >
        {announceError}
      </Text>
    )}
  </View>
);
```

### 2. キーボードナビゲーション対応

#### 2.1 タブオーダー設定
```typescript
// 適切なタブオーダーの設定
<View>
  <TextInput
    accessibilityLabel="ユーザーID"
    tabIndex={1}
    onSubmitEditing={() => passwordRef.current?.focus()}
  />
  
  <TextInput
    ref={passwordRef}
    accessibilityLabel="パスワード"
    tabIndex={2}
    onSubmitEditing={handleLogin}
  />
  
  <Button
    text="ログイン"
    tabIndex={3}
    onPress={handleLogin}
  />
</View>
```

#### 2.2 キーボードショートカット
```typescript
// ESCキーでモーダル閉じる
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    setModalVisible(false);
  }
  if (event.key === 'Enter' && event.ctrlKey) {
    handleSubmit();
  }
};

useEffect(() => {
  const keyboardListener = Keyboard.addListener('keypress', handleKeyPress);
  return () => keyboardListener.remove();
}, []);
```

### 3. 色・コントラスト対応

#### 3.1 カラーコントラスト比改善
```typescript
// 現在のカラー定義の確認・改善
export const accessibleColors = {
  // WCAG AA準拠 (4.5:1以上)
  primaryText: '#000000',        // 黒文字
  secondaryText: '#666666',      // グレー文字 (コントラスト比7:1)
  errorText: '#CC0000',          // エラー赤 (コントラスト比5.9:1)
  
  // ボタンカラー
  primaryButton: '#0056b3',      // 青ボタン (コントラスト比4.6:1)
  secondaryButton: '#6c757d',    // グレーボタン (コントラスト比4.6:1)
  
  // 背景色
  primaryBackground: '#ffffff',   // 白背景
  secondaryBackground: '#f8f9fa', // ライトグレー背景
};
```

#### 3.2 色のみに依存しない情報伝達
```typescript
// Before: 色のみでエラー表示
<Text style={{ color: 'red' }}>エラーが発生しました</Text>

// After: アイコン + 色 + テキストでエラー表示
<View style={styles.errorContainer}>
  <Ionicons 
    name="alert-circle" 
    size={16} 
    color={accessibleColors.errorText}
    accessibilityLabel="エラーアイコン"
  />
  <Text style={styles.errorText}>
    エラーが発生しました: {errorMessage}
  </Text>
</View>
```

### 4. 操作性改善

#### 4.1 タッチターゲットサイズ
```typescript
// WCAG準拠の最小タッチサイズ: 44x44pt
const accessibleStyles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // 小さなアイコンボタンもタッチ領域を確保
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

#### 4.2 フォーカス表示
```typescript
// フォーカス時のビジュアルフィードバック
const [isFocused, setIsFocused] = useState(false);

<Pressable
  style={[
    styles.button,
    isFocused && styles.buttonFocused
  ]}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  accessibilityLabel="ログインボタン"
>
  <Text>ログイン</Text>
</Pressable>

// スタイル定義
const styles = StyleSheet.create({
  button: {
    backgroundColor: accessibleColors.primaryButton,
    borderRadius: 8,
    padding: 12,
  },
  buttonFocused: {
    borderWidth: 2,
    borderColor: '#007bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
```

### 5. 画面別アクセシビリティ実装

#### 5.1 ログイン画面
```typescript
export const Login = ({ navigation }: Props) => {
  return (
    <SafeAreaView 
      style={styles.container}
      accessibilityLabel="ログイン画面"
      accessibilityRole="main"
    >
      <StatusBar barStyle="dark-content" />
      
      <Header 
        titleName="受付システム" 
        accessibilityLabel="受付システム ログイン画面"
        accessibilityRole="header"
      />
      
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        accessibilityLabel="ログインフォーム"
      >
        <View style={styles.formContainer}>
          <Text 
            style={styles.title}
            accessibilityRole="heading"
            accessibilityLevel={1}
          >
            ログイン
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="ユーザーID"
            value={userid}
            onChangeText={setUserId}
            accessibilityLabel="ユーザーID入力欄"
            accessibilityHint="受付担当者のIDを入力してください"
            autoComplete="username"
            textContentType="username"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="パスワード入力欄"
              accessibilityHint="パスワードを入力してください"
              autoComplete="password"
              textContentType="password"
            />
            
            <Pressable
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              accessibilityRole="button"
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color={accessibleColors.secondaryText}
              />
            </Pressable>
          </View>
          
          {errorMessage && (
            <View 
              style={styles.errorContainer}
              accessibilityLiveRegion="polite"
            >
              <Ionicons 
                name="alert-circle" 
                size={16} 
                color={accessibleColors.errorText}
                accessibilityLabel="エラーアイコン"
              />
              <Text 
                style={styles.errorText}
                accessibilityLabel={`エラー: ${errorMessage}`}
              >
                {errorMessage}
              </Text>
            </View>
          )}
          
          <Button
            text="ログイン"
            onPress={handleLogin}
            type="ButtonMPrimary"
            accessibilityLabel="ログインボタン"
            accessibilityHint="タップすると受付システムにログインします"
            accessibilityRole="button"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
```

#### 5.2 QRスキャナー画面
```typescript
export const SelfqrScanner = ({ navigation }: Props) => {
  return (
    <SafeAreaView 
      style={styles.container}
      accessibilityLabel="QRコードスキャナー画面"
    >
      <Header 
        titleName="自己QRをかざしてください"
        buttonName="受付をやめる"
        onPress={() => navigation.goBack()}
        accessibilityLabel="QRスキャナー画面ヘッダー"
      />
      
      {hasPermission === null && (
        <Text 
          style={styles.permissionText}
          accessibilityLiveRegion="polite"
        >
          カメラの権限を要求しています...
        </Text>
      )}
      
      {hasPermission === false && (
        <View 
          style={styles.permissionDenied}
          accessibilityRole="alert"
        >
          <Text style={styles.permissionText}>
            カメラの権限が必要です
          </Text>
          <Button
            text="設定を開く"
            onPress={openSettings}
            accessibilityLabel="設定アプリを開いてカメラ権限を許可"
            accessibilityHint="設定アプリでカメラ権限を有効にしてください"
          />
        </View>
      )}
      
      {hasPermission && (
        <>
          <Camera
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            accessibilityLabel="QRコードスキャンカメラ"
            accessibilityHint="QRコードをカメラに向けてください"
          />
          
          <View style={styles.scanArea}>
            <Text 
              style={styles.scanInstruction}
              accessibilityLabel="スキャン指示"
            >
              QRコードを枠内に合わせてください
            </Text>
          </View>
          
          {scanned && (
            <Button
              text="再スキャン"
              onPress={() => setScanned(false)}
              accessibilityLabel="再スキャンボタン"
              accessibilityHint="もう一度QRコードをスキャンします"
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};
```

## テスト・検証方法

### 1. 自動テスト
```typescript
// アクセシビリティテスト
describe('Accessibility Tests', () => {
  it('should have proper accessibility labels', () => {
    const { getByLabelText } = render(<Login />);
    
    expect(getByLabelText('ユーザーID入力欄')).toBeTruthy();
    expect(getByLabelText('パスワード入力欄')).toBeTruthy();
    expect(getByLabelText('ログインボタン')).toBeTruthy();
  });

  it('should announce errors to screen readers', () => {
    const { getByLabelText } = render(<Login />);
    
    // エラー発生シミュレーション
    fireEvent.changeText(getByLabelText('ユーザーID入力欄'), '');
    fireEvent.press(getByLabelText('ログインボタン'));
    
    expect(getByLabelText(/エラー:/)).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const { getByRole } = render(<Login />);
    
    const heading = getByRole('heading');
    expect(heading.props.accessibilityLevel).toBe(1);
  });
});
```

### 2. 手動テスト

#### スクリーンリーダーテスト
- [ ] iOS VoiceOver での全画面ナビゲーション
- [ ] Android TalkBack での全画面ナビゲーション  
- [ ] 適切な読み上げ順序の確認
- [ ] エラーメッセージの音声通知確認

#### キーボードナビゲーションテスト
- [ ] Tab キーでの要素間移動
- [ ] Enter キーでのボタン操作
- [ ] Escape キーでのモーダル閉じる操作

#### 色覚異常テスト
- [ ] 色覚異常シミュレーターでの確認
- [ ] グレースケール表示での情報判別

## 実装スケジュール

### Week 1: 基本実装
- Day 1-2: アクセシビリティラベル追加
- Day 3-4: キーボードナビゲーション対応
- Day 5: 色・コントラスト改善

### Week 2: 画面別実装・テスト
- Day 1-3: 各画面のアクセシビリティ実装
- Day 4-5: テスト・検証

## 成功指標
- [ ] スクリーンリーダーでの全画面操作可能
- [ ] キーボードのみでの全機能操作可能
- [ ] WCAG 2.1 AA準拠（色コントラスト4.5:1以上）
- [ ] アクセシビリティテスト100%パス

## 所要時間
約10日

## 参考資料
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)
# タスク3: ユニットテスト実装

## 概要
コードの品質保証とリグレッション防止のため、主要コンポーネントとモデルクラスのユニットテストを実装する。

## テスト戦略

### テストフレームワーク選定
- **React Native**: Jest + React Native Testing Library
- **理由**: Expo/React Native の標準的なテスト環境

### テスト対象優先度

#### 🟥 高優先度: モデルクラス
1. **User.ts** - ユーザー情報管理
2. **Entrant.ts** - 参加者情報管理
3. **Param.ts** - パラメータ管理

#### 🟨 中優先度: ユーティリティ・サービス
4. **ActivityLogger** - ログ機能
5. **API ハンドラー** - データ通信
6. **バリデーション関数**

#### 🟩 低優先度: コンポーネント
7. **Button** - 基本コンポーネント
8. **Dialog** - モーダルコンポーネント
9. **Header** - ヘッダーコンポーネント

## 詳細テスト仕様

### 1. User.ts テスト

#### テストケース
```typescript
describe('User Model', () => {
  it('should create user with default values', () => {
    const user = new User();
    expect(user.userId).toBe("");
  });

  it('should set and get userId correctly', () => {
    const user = new User();
    user.userId = "test123";
    expect(user.userId).toBe("test123");
  });

  it('should clone user correctly', () => {
    const user = new User();
    user.userId = "original";
    const cloned = user.clone();
    
    expect(cloned.userId).toBe("original");
    expect(cloned).not.toBe(user); // 異なるインスタンス
  });

  it('should return correct string representation', () => {
    const user = new User();
    user.userId = "test123";
    const result = user.getAllValuesAsString();
    
    expect(result).toContain("ClassName=User");
    expect(result).toContain("_userId=test123");
  });
});
```

### 2. Entrant.ts テスト

#### テストケース（推定実装基準）
```typescript
describe('Entrant Model', () => {
  it('should create entrant with default values', () => {
    const entrant = new Entrant();
    // 各プロパティのデフォルト値確認
  });

  it('should validate required fields', () => {
    const entrant = new Entrant();
    // 必須フィールドのバリデーション確認
  });

  it('should handle Japanese names correctly', () => {
    const entrant = new Entrant();
    entrant.name = "田中太郎";
    expect(entrant.name).toBe("田中太郎");
  });

  it('should validate email format', () => {
    const entrant = new Entrant();
    // 正常なメール
    entrant.email = "test@example.com";
    expect(entrant.isValidEmail()).toBe(true);
    
    // 不正なメール
    entrant.email = "invalid-email";
    expect(entrant.isValidEmail()).toBe(false);
  });

  it('should validate phone number format', () => {
    const entrant = new Entrant();
    // 日本の電話番号形式テスト
    entrant.phoneNumber = "090-1234-5678";
    expect(entrant.isValidPhoneNumber()).toBe(true);
  });

  it('should handle postal code correctly', () => {
    const entrant = new Entrant();
    entrant.postalCode = "123-4567";
    expect(entrant.postalCode).toBe("123-4567");
  });
});
```

### 3. パラメータクラステスト

#### EventListParams テスト
```typescript
describe('EventListParams', () => {
  it('should serialize and deserialize correctly', () => {
    const params = new EventListParams();
    params.userId = "user123";
    
    const serialized = params.getAllValuesAsString();
    // シリアライゼーション確認
    expect(serialized).toContain("userId=user123");
  });

  it('should clone correctly', () => {
    const original = new EventListParams();
    original.userId = "original";
    
    const cloned = original.clone();
    expect(cloned.userId).toBe("original");
    expect(cloned).not.toBe(original);
  });
});
```

### 4. ユーティリティ関数テスト

#### バリデーション関数テスト
```typescript
describe('Validation Utils', () => {
  describe('Email Validation', () => {
    it.each([
      ['test@example.com', true],
      ['user.name@domain.co.jp', true],
      ['invalid-email', false],
      ['@domain.com', false],
      ['user@', false],
    ])('should validate %s as %s', (email, expected) => {
      expect(isValidEmail(email)).toBe(expected);
    });
  });

  describe('Phone Number Validation', () => {
    it.each([
      ['090-1234-5678', true],
      ['03-1234-5678', true],
      ['0120-123-456', true],
      ['123-456', false],
      ['abc-defg-hijk', false],
    ])('should validate %s as %s', (phone, expected) => {
      expect(isValidPhoneNumber(phone)).toBe(expected);
    });
  });

  describe('Postal Code Validation', () => {
    it.each([
      ['123-4567', true],
      ['1234567', true],
      ['12-345', false],
      ['abc-defg', false],
    ])('should validate %s as %s', (postalCode, expected) => {
      expect(isValidPostalCode(postalCode)).toBe(expected);
    });
  });
});
```

### 5. コンポーネントテスト

#### Button コンポーネントテスト
```typescript
describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button text="テストボタン" />);
    expect(screen.getByText('テストボタン')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<Button text="ボタン" onPress={mockOnPress} />);
    
    fireEvent.press(screen.getByText('ボタン'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should apply correct styles for ButtonMPrimary', () => {
    render(<Button text="ボタン" type="ButtonMPrimary" />);
    const button = screen.getByText('ボタン').parent;
    
    // スタイル確認（実際のスタイル定義に基づく）
    expect(button).toHaveStyle({
      backgroundColor: colors.primary,
    });
  });

  it('should be disabled when type is ButtonMDisable', () => {
    const mockOnPress = jest.fn();
    render(<Button text="ボタン" type="ButtonMDisable" onPress={mockOnPress} />);
    
    fireEvent.press(screen.getByText('ボタン'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should render icon in correct position', () => {
    const TestIcon = () => <Text>アイコン</Text>;
    render(
      <Button 
        text="ボタン" 
        icon={<TestIcon />} 
        iconPosition="front" 
      />
    );
    
    expect(screen.getByText('アイコン')).toBeTruthy();
    expect(screen.getByText('ボタン')).toBeTruthy();
  });
});
```

#### Dialog コンポーネントテスト
```typescript
describe('Dialog Component', () => {
  it('should render dialog when visible', () => {
    render(
      <Dialog
        visible={true}
        dialogTitle="テストタイトル"
        text="テスト内容"
      />
    );
    
    expect(screen.getByText('テストタイトル')).toBeTruthy();
    expect(screen.getByText('テスト内容')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    render(
      <Dialog
        visible={false}
        dialogTitle="テストタイトル"
        text="テスト内容"
      />
    );
    
    expect(screen.queryByText('テストタイトル')).toBeNull();
  });

  it('should call onFirstButtonPress when first button is pressed', () => {
    const mockPress = jest.fn();
    render(
      <Dialog
        visible={true}
        dialogTitle="タイトル"
        firstButtonText="OK"
        onFirstButtonPress={mockPress}
      />
    );
    
    fireEvent.press(screen.getByText('OK'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('should render success icon when iconColor is green', () => {
    render(
      <Dialog
        visible={true}
        dialogTitle="成功"
        iconColor="green"
        iconVisible={true}
      />
    );
    
    // アイコンの存在確認（実際の実装に基づく）
    expect(screen.getByTestId('success-icon')).toBeTruthy();
  });
});
```

## テスト環境構築

### 1. 依存関係追加
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.0.0",
    "@testing-library/jest-native": "^5.4.0",
    "jest": "^29.0.0",
    "react-test-renderer": "^18.2.0"
  }
}
```

### 2. Jest設定
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/assets/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 3. テストスクリプト追加
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 実装スケジュール

### Week 1: 環境構築・モデルテスト
- Day 1-2: テスト環境構築
- Day 3-5: モデルクラステスト実装

### Week 2: コンポーネント・ユーティリティテスト
- Day 1-3: 基本コンポーネントテスト
- Day 4-5: ユーティリティ関数テスト

## 成功指標
- [ ] テストカバレッジ 70%以上
- [ ] 全テストケース Pass
- [ ] CI/CD パイプラインでのテスト自動実行
- [ ] コードレビュー時のテスト必須化

## 参考資料
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Guide](https://reactnative.dev/docs/testing-overview)

## 所要時間
約10日（環境構築含む）
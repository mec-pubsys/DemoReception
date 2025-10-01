# タスク5: セキュリティ強化

## 概要
受付システムで扱う個人情報・認証情報のセキュリティを向上させ、潜在的な脆弱性を解決する。

## セキュリティ脅威分析

### 🔴 高リスク項目

#### 1. ハードコードされた認証情報
**現在の問題:**
```typescript
// App.tsx L42-48 - 認証情報がハードコード
signInWithEmailAndPassword(
  userAuth,
  "city-staff-base@matsusaka.co.jp",  // ❌ ハードコード
  "Pg37gRm20b58z3D5"                   // ❌ ハードコード
)
```

**セキュリティリスク:**
- 認証情報がソースコードに露出
- Git履歴に機密情報が永続化
- リバースエンジニアリングで情報漏洩

#### 2. 依存関係の脆弱性
**検出された脆弱性:**
```
33 vulnerabilities (3 low, 14 moderate, 16 high)
```

#### 3. Firebase設定の露出
**潜在的リスク:**
- Firebase設定キーの適切な保護確認が必要
- API キー・DB接続情報の露出可能性

### 🟡 中リスク項目

#### 4. 入力検証の不備
- ユーザー入力のサニタイゼーション
- SQLインジェクション対策（DynamoDB使用時）
- XSS対策

#### 5. ログ情報の機密性
```typescript
// ActivityLogger で個人情報がログに記録される可能性
ActivityLogger.insertInfoLogEntry(
  new User(), 
  'Login', 
  'checkLogin', 
  'login', 
  '', 
  null, 
  '', 
  'userid=' + userid + ',password=' + password  // ❌ パスワードがログに
);
```

## 対策実装

### 1. 環境変数による機密情報管理

#### 1.1 環境変数設定ファイル作成
```typescript
// src/config/env.ts
interface EnvConfig {
  FIREBASE_AUTH_EMAIL: string;
  FIREBASE_AUTH_PASSWORD: string;
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

// 開発環境用設定
const developmentConfig: EnvConfig = {
  FIREBASE_AUTH_EMAIL: process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMAIL || '',
  FIREBASE_AUTH_PASSWORD: process.env.EXPO_PUBLIC_FIREBASE_AUTH_PASSWORD || '',
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  AWS_REGION: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-northeast-1',
  AWS_ACCESS_KEY_ID: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
};

// 本番環境用設定（より厳重な管理）
const productionConfig: EnvConfig = {
  // 本番環境では環境変数必須
  FIREBASE_AUTH_EMAIL: process.env.FIREBASE_AUTH_EMAIL!,
  FIREBASE_AUTH_PASSWORD: process.env.FIREBASE_AUTH_PASSWORD!,
  // ... その他の設定
};

export const env = __DEV__ ? developmentConfig : productionConfig;

// 設定検証
const validateEnv = () => {
  const requiredVars = Object.keys(env) as (keyof EnvConfig)[];
  const missingVars = requiredVars.filter(key => !env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};

validateEnv();
```

#### 1.2 .env ファイル設定
```bash
# .env.local (Gitignore対象)
EXPO_PUBLIC_FIREBASE_AUTH_EMAIL=city-staff-base@matsusaka.co.jp
EXPO_PUBLIC_FIREBASE_AUTH_PASSWORD=secure_password_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_AWS_REGION=ap-northeast-1
EXPO_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key
EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### 1.3 アプリケーション修正
```typescript
// App.tsx 修正版
import { env } from './src/config/env';

export default function App() {
  // ... 既存コード

  useEffect(() => {
    // 環境変数を使用した認証
    signInWithEmailAndPassword(
      userAuth,
      env.FIREBASE_AUTH_EMAIL,
      env.FIREBASE_AUTH_PASSWORD
    ).catch((error) => {
      console.log("Auto sign-in failed:", error);
      // セキュリティ上、詳細なエラー情報は本番環境では非表示
      if (__DEV__) {
        console.error("詳細エラー:", error);
      }
    });
  }, []);

  // ... 残りのコード
}
```

### 2. 入力検証・サニタイゼーション

#### 2.1 バリデーション関数強化
```typescript
// src/utils/validation.ts
import DOMPurify from 'isomorphic-dompurify';

export class InputValidator {
  // XSS対策 - HTMLサニタイゼーション
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input);
  }

  // SQLインジェクション対策 - 特殊文字エスケープ
  static escapeSql(input: string): string {
    return input.replace(/['";\\]/g, '\\$&');
  }

  // ユーザーID検証 - 英数字のみ許可
  static validateUserId(userId: string): ValidationResult {
    const regex = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!regex.test(userId)) {
      return {
        isValid: false,
        error: 'ユーザーIDは3-50文字の英数字、ハイフン、アンダースコアのみ使用可能です'
      };
    }
    return { isValid: true };
  }

  // パスワード強度検証
  static validatePassword(password: string): ValidationResult {
    if (password.length < 8) {
      return {
        isValid: false,
        error: 'パスワードは8文字以上である必要があります'
      };
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpper && hasLower && hasNumber && hasSymbol)) {
      return {
        isValid: false,
        error: 'パスワードには大文字、小文字、数字、記号をそれぞれ含める必要があります'
      };
    }

    return { isValid: true };
  }

  // メールアドレス検証
  static validateEmail(email: string): ValidationResult {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return {
        isValid: false,
        error: '有効なメールアドレスを入力してください'
      };
    }

    // 長すぎるメールアドレスを拒否
    if (email.length > 254) {
      return {
        isValid: false,
        error: 'メールアドレスが長すぎます'
      };
    }

    return { isValid: true };
  }

  // 電話番号検証（日本の形式）
  static validatePhoneNumber(phone: string): ValidationResult {
    // 日本の電話番号形式（ハイフンあり・なし両対応）
    const regex = /^(\+81|0)\d{1,4}-?\d{1,4}-?\d{4}$/;
    if (!regex.test(phone)) {
      return {
        isValid: false,
        error: '有効な電話番号を入力してください（例: 090-1234-5678）'
      };
    }
    return { isValid: true };
  }

  // 郵便番号検証（日本形式）
  static validatePostalCode(postalCode: string): ValidationResult {
    const regex = /^\d{3}-?\d{4}$/;
    if (!regex.test(postalCode)) {
      return {
        isValid: false,
        error: '有効な郵便番号を入力してください（例: 123-4567）'
      };
    }
    return { isValid: true };
  }

  // 一般的な文字列長制限
  static validateStringLength(
    input: string, 
    fieldName: string,
    minLength: number = 0,
    maxLength: number = 255
  ): ValidationResult {
    if (input.length < minLength) {
      return {
        isValid: false,
        error: `${fieldName}は${minLength}文字以上入力してください`
      };
    }

    if (input.length > maxLength) {
      return {
        isValid: false,
        error: `${fieldName}は${maxLength}文字以下にしてください`
      };
    }

    return { isValid: true };
  }

  // 危険な文字列パターン検出
  static detectMaliciousPatterns(input: string): ValidationResult {
    const maliciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,  // Script tags
      /javascript:/gi,                          // JavaScript protocol
      /vbscript:/gi,                           // VBScript protocol
      /on\w+\s*=/gi,                           // Event handlers
      /expression\s*\(/gi,                     // CSS expressions
      /url\s*\(/gi,                           // CSS url()
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          error: '不正な文字列が検出されました'
        };
      }
    }

    return { isValid: true };
  }
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

#### 2.2 フォーム入力での検証適用
```typescript
// src/screens/login/Login.tsx 修正版
export const Login = ({ navigation }: Props) => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // ユーザーID検証
    const userIdValidation = InputValidator.validateUserId(userid);
    if (!userIdValidation.isValid) {
      errors.userid = userIdValidation.error!;
    }

    // パスワード検証
    const passwordValidation = InputValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!;
    }

    // 悪意のあるパターン検出
    const maliciousCheck = InputValidator.detectMaliciousPatterns(userid + password);
    if (!maliciousCheck.isValid) {
      errors.security = maliciousCheck.error!;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    // サニタイズされた入力で処理継続
    const sanitizedUserId = InputValidator.sanitizeHtml(userid);
    const sanitizedPassword = password; // パスワードはハッシュ化されるのでサニタイズ不要

    // 既存のログイン処理...
  };

  // ... 残りのコンポーネント
};
```

### 3. ログセキュリティ改善

#### 3.1 セキュアログ機能
```typescript
// src/log/SecureActivityLogger.ts
export class SecureActivityLogger {
  private static readonly SENSITIVE_FIELDS = [
    'password', 'token', 'secret', 'key', 'credential'
  ];

  // 機密情報をマスクしてログ出力
  static insertSecureLogEntry(
    user: User,
    screenName: string,
    functionName: string,
    action: string,
    errorMessage: string = '',
    error: any = null,
    exceptionDetail: string = '',
    parameters: string = ''
  ) {
    // パラメータから機密情報を削除
    const sanitizedParameters = this.sanitizeParameters(parameters);
    
    // 本番環境では詳細なエラー情報を記録しない
    const sanitizedError = __DEV__ ? error : null;
    const sanitizedErrorMessage = this.sanitizeErrorMessage(errorMessage);

    ActivityLogger.insertInfoLogEntry(
      user,
      screenName,
      functionName,
      action,
      sanitizedErrorMessage,
      sanitizedError,
      exceptionDetail,
      sanitizedParameters
    );
  }

  private static sanitizeParameters(parameters: string): string {
    let sanitized = parameters;
    
    this.SENSITIVE_FIELDS.forEach(field => {
      const regex = new RegExp(`${field}=([^,]+)`, 'gi');
      sanitized = sanitized.replace(regex, `${field}=***`);
    });

    return sanitized;
  }

  private static sanitizeErrorMessage(errorMessage: string): string {
    if (!errorMessage) return '';

    // 本番環境では具体的なエラー情報を隠す  
    if (!__DEV__) {
      return 'エラーが発生しました';
    }

    return errorMessage;
  }

  // PII（個人識別情報）のマスク処理
  static maskPII(input: string): string {
    return input
      .replace(/\b\d{3}-\d{4}-\d{4}\b/g, '***-****-****') // 電話番号
      .replace(/\b\d{3}-\d{4}\b/g, '***-****')            // 郵便番号
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '***@***.***')     // メールアドレス
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '****************'); // クレジットカード番号
  }
}
```

#### 3.2 ログ使用箇所の修正
```typescript
// ログイン処理の修正例
export const Login = ({ navigation }: Props) => {
  const checkLogin = () => {
    // 機密情報を含まないログ
    SecureActivityLogger.insertSecureLogEntry(
      new User(), 
      'Login', 
      'checkLogin', 
      'login attempt',
      '',
      null,
      '',
      `userid=${userid.substring(0, 3)}***` // 一部マスク
    );

    // ... 既存のログイン処理
  };
};
```

### 4. 依存関係セキュリティ向上

#### 4.1 脆弱性修正
```bash
# パッケージ監査・修正
npm audit
npm audit fix

# 高リスクな依存関係の個別対応
npm update react-native
npm update expo
npm update firebase
```

#### 4.2 セキュリティ監視自動化
```yaml
# .github/workflows/security-audit.yml
name: Security Audit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # 毎週月曜日2時に実行

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Run npm audit
      run: npm audit --audit-level high
      working-directory: ./example
      
    - name: Run license check
      run: npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC'
      working-directory: ./example
```

### 5. データ暗号化

#### 5.1 ローカルストレージ暗号化
```typescript
// src/utils/SecureStorage.ts
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'your-encryption-key-here';

  // データの暗号化保存
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, this.ENCRYPTION_KEY).toString();
      await SecureStore.setItemAsync(key, encrypted);
    } catch (error) {
      console.error('セキュアストレージへの保存に失敗:', error);
      throw error;
    }
  }

  // 暗号化データの復号化取得
  static async getSecureItem(key: string): Promise<string | null> {
    try {
      const encrypted = await SecureStore.getItemAsync(key);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('セキュアストレージからの取得に失敗:', error);
      return null;
    }
  }

  // セキュアデータの削除
  static async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('セキュアストレージからの削除に失敗:', error);
      throw error;
    }
  }
}
```

## 実装スケジュール

### Week 1: 基盤セキュリティ
- Day 1-2: 環境変数設定・機密情報外部化
- Day 3-4: 入力検証・サニタイゼーション実装
- Day 5: ログセキュリティ改善

### Week 2: 応用セキュリティ・テスト
- Day 1-2: データ暗号化実装
- Day 3: 依存関係脆弱性修正
- Day 4-5: セキュリティテスト・監査

## 検証・テスト方法

### セキュリティテスト
```typescript
// セキュリティテストケース
describe('Security Tests', () => {
  describe('Input Validation', () => {
    it('should reject malicious script injection', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const result = InputValidator.detectMaliciousPatterns(maliciousInput);
      expect(result.isValid).toBe(false);
    });

    it('should sanitize HTML input', () => {
      const htmlInput = '<p>正常なテキスト<script>alert("悪意")</script></p>';
      const sanitized = InputValidator.sanitizeHtml(htmlInput);
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('Secure Storage', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const testData = 'sensitive-information';
      await SecureStorage.setSecureItem('test-key', testData);
      const retrieved = await SecureStorage.getSecureItem('test-key');
      expect(retrieved).toBe(testData);
    });
  });

  describe('Logging Security', () => {
    it('should mask sensitive information in logs', () => {
      const sensitiveLog = 'userid=test,password=secret123';
      const sanitized = SecureActivityLogger.sanitizeParameters(sensitiveLog);
      expect(sanitized).toBe('userid=test,password=***');
    });
  });
});
```

## 成功指標
- [ ] ハードコードされた機密情報 0件
- [ ] npm audit 脆弱性 0件（高・重要度）
- [ ] セキュリティテスト 100%パス
- [ ] PII情報の適切なマスク処理
- [ ] 暗号化された機密情報保存

## 所要時間
約10日

## 参考資料
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security Guide](https://reactnative.dev/docs/security)
- [Expo Security](https://docs.expo.dev/guides/security/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
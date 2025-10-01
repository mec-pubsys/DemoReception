# タスク7: CI/CD パイプライン構築

## 概要
GitHub Actions を使用してコード品質保証・自動テスト・デプロイを自動化する開発パイプラインを構築する。

## CI/CD アーキテクチャ

### パイプライン構成
```
📝 Code Push/PR → 🔍 Quality Gate → 🧪 Testing → 🚀 Deployment
                   │                │              │
                   ├─ ESLint       ├─ Unit Tests   ├─ Staging
                   ├─ TypeScript   ├─ E2E Tests    └─ Production
                   ├─ Security     └─ Accessibility
                   └─ Dependencies
```

## GitHub Actions ワークフロー

### 1. コード品質チェック

#### `.github/workflows/code-quality.yml`
```yaml
name: Code Quality Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Run ESLint
      run: |
        npm run lint || {
          echo "❌ ESLint failed. Please fix the linting errors."
          exit 1
        }
      working-directory: ./example
      
    - name: Run TypeScript check
      run: |
        npx tsc --noEmit || {
          echo "❌ TypeScript compilation failed. Please fix type errors."
          exit 1
        }
      working-directory: ./example
      
    - name: Run Prettier check
      run: |
        npx prettier --check "src/**/*.{ts,tsx,js,jsx}" || {
          echo "❌ Code formatting check failed. Run 'npm run format' to fix."
          exit 1
        }
      working-directory: ./example
      
    - name: Check for TODO/FIXME comments
      run: |
        if grep -r "TODO\|FIXME" example/src/; then
          echo "⚠️  Found TODO/FIXME comments. Please address them before merging."
          exit 1
        fi
        
  security-audit:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Run npm audit
      run: |
        npm audit --audit-level high || {
          echo "❌ High security vulnerabilities found. Please fix them."
          exit 1
        }
      working-directory: ./example
      
    - name: Check for hardcoded secrets
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
        
    - name: License compliance check
      run: |
        npx license-checker \
          --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD' \
          --excludePrivatePackages || {
            echo "❌ License compliance check failed."
            exit 1
          }
      working-directory: ./example
```

### 2. テスト実行

#### `.github/workflows/tests.yml`
```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
        
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Run unit tests
      run: |
        npm run test -- --coverage --watchAll=false || {
          echo "❌ Unit tests failed."
          exit 1
        }
      working-directory: ./example
      env:
        CI: true
        
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./example/coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
        
    - name: Coverage threshold check
      run: |
        COVERAGE=$(npm run test:coverage:check 2>/dev/null || echo "0")
        if [ "$COVERAGE" -lt 70 ]; then
          echo "❌ Coverage is below 70%: $COVERAGE%"
          exit 1
        fi
        echo "✅ Coverage: $COVERAGE%"
      working-directory: ./example

  integration-tests:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Start test servers
      run: |
        # Firebase Emulator
        npm install -g firebase-tools
        firebase emulators:start --only auth,database --detach
        
        # Metro bundler for testing
        npm start &
        sleep 30
      working-directory: ./example
      
    - name: Run integration tests
      run: |
        npm run test:integration || {
          echo "❌ Integration tests failed."
          exit 1
        }
      working-directory: ./example
      env:
        FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
        FIREBASE_DATABASE_EMULATOR_HOST: localhost:9000

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Setup Expo CLI
      run: npm install -g @expo/cli
      
    - name: Start Expo
      run: |
        expo start --web --non-interactive &
        sleep 60
      working-directory: ./example
      
    - name: Install Playwright
      run: npx playwright install --with-deps
      
    - name: Run E2E tests
      run: |
        npm run test:e2e || {
          echo "❌ E2E tests failed."
          exit 1
        }
      working-directory: ./example
      
    - name: Upload test artifacts
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: e2e-test-results
        path: example/test-results/
```

### 3. デプロイメント

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Setup Expo CLI
      run: npm install -g @expo/cli eas-cli
      
    - name: Authenticate with Expo
      run: expo login --non-interactive
      env:
        EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        
    - name: Build for staging
      run: |
        eas build --platform all --profile staging --non-interactive || {
          echo "❌ Staging build failed."
          exit 1
        }
      working-directory: ./example
      env:
        EXPO_PUBLIC_ENV: staging
        EXPO_PUBLIC_FIREBASE_AUTH_EMAIL: ${{ secrets.STAGING_FIREBASE_AUTH_EMAIL }}
        EXPO_PUBLIC_FIREBASE_AUTH_PASSWORD: ${{ secrets.STAGING_FIREBASE_AUTH_PASSWORD }}
        
    - name: Deploy to Expo
      run: |
        expo publish --release-channel staging || {
          echo "❌ Staging deployment failed."
          exit 1
        }
      working-directory: ./example
      
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: "🚀 Staging deployment completed: https://exp.host/@youruser/demoreception?release-channel=staging"
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  deploy-production:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Setup Expo CLI
      run: npm install -g @expo/cli eas-cli
      
    - name: Authenticate with Expo
      run: expo login --non-interactive
      env:
        EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        
    - name: Build for production
      run: |
        eas build --platform all --profile production --non-interactive || {
          echo "❌ Production build failed."
          exit 1
        }
      working-directory: ./example
      env:
        EXPO_PUBLIC_ENV: production
        EXPO_PUBLIC_FIREBASE_AUTH_EMAIL: ${{ secrets.PROD_FIREBASE_AUTH_EMAIL }}
        EXPO_PUBLIC_FIREBASE_AUTH_PASSWORD: ${{ secrets.PROD_FIREBASE_AUTH_PASSWORD }}
        
    - name: Submit to app stores
      run: |
        eas submit --platform all --latest || {
          echo "❌ App store submission failed."
          exit 1
        }
      working-directory: ./example
      
    - name: Deploy to Expo
      run: |
        expo publish --release-channel production || {
          echo "❌ Production deployment failed."
          exit 1
        }
      working-directory: ./example
      
    - name: Create GitHub Pages deployment
      run: |
        npm run build:web
        echo "demoreception.example.com" > build/CNAME
      working-directory: ./example
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./example/build
        
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: "🎉 Production deployment completed! App stores submission in progress."
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 4. ブランチ保護・品質ゲート

#### `.github/workflows/branch-protection.yml`
```yaml
name: Branch Protection

on:
  pull_request:
    branches: [ main ]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: example/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: ./example
      
    - name: Check commit message format
      run: |
        git log --oneline -1 --pretty=format:"%s" | grep -E "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}" || {
          echo "❌ Commit message does not follow Conventional Commits format"
          echo "Format: type(scope): description"
          echo "Example: feat(login): add password visibility toggle"
          exit 1
        }
        
    - name: Check for breaking changes
      run: |
        git diff --name-only origin/main..HEAD | grep -E "(package\.json|app\.json|expo\.json)" && {
          echo "⚠️  Configuration files changed. Manual review required."
        } || true
        
    - name: Require all checks to pass
      run: |
        echo "✅ All quality gates passed"
```

## 開発ツール設定

### 1. package.json スクリプト追加
```json
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src/ --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:coverage:check": "jest --coverage --silent | grep 'All files' | awk '{print $10}' | sed 's/%//'",
    "test:watch": "jest --watch",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "build:web": "expo build:web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "deploy:staging": "expo publish --release-channel staging",
    "deploy:production": "expo publish --release-channel production"
  }
}
```

### 2. ESLint 設定
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'expo',
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'import',
    'jsx-a11y'
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // React
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always'
    }],
    
    // Accessibility
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'warn',
    
    // General
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    'coverage/'
  ]
};
```

### 3. Prettier 設定
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 4. GitHub repository settings
```yaml
# .github/branch-protection.yml (設定参考)
branch_protection_rules:
  - pattern: "main"
    required_status_checks:
      strict: true
      contexts:
        - "Code Quality Check / lint-and-type-check"
        - "Code Quality Check / security-audit"
        - "Tests / unit-tests (18)"
        - "Tests / integration-tests"
        - "Branch Protection / quality-gate"
    enforce_admins: true
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions: null
```

## 環境管理

### 1. 環境別設定
```typescript
// app.config.ts
export default ({ config }: any) => {
  const environment = process.env.EXPO_PUBLIC_ENV || 'development';
  
  const baseConfig = {
    ...config,
    name: environment === 'production' ? 'DemoReception' : `DemoReception (${environment})`,
    slug: 'demoreception',
    version: '1.0.0',
    platforms: ['ios', 'android', 'web'],
  };

  if (environment === 'staging') {
    return {
      ...baseConfig,
      extra: {
        environment: 'staging',
        apiUrl: 'https://staging-api.example.com',
      },
    };
  }

  if (environment === 'production') {
    return {
      ...baseConfig,
      extra: {
        environment: 'production',
        apiUrl: 'https://api.example.com',
      },
    };
  }

  return {
    ...baseConfig,
    extra: {
      environment: 'development',
      apiUrl: 'http://localhost:3000',
    },
  };
};
```

### 2. EAS 設定
```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "development"
      }
    },
    "staging": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "production"
      }
    }
  }
}
```

## 実装スケジュール

### Phase 1: 基本パイプライン (2日)
- GitHub Actions ワークフロー作成
- ESLint, Prettier, TypeScript チェック

### Phase 2: テスト自動化 (2日)
- Unit test, Integration test 実行
- カバレッジ計測・レポート

### Phase 3: デプロイメント (1日)
- Staging/Production デプロイ
- アプリストア申請自動化

## 成功指標
- [ ] 全 PR で品質チェック実行
- [ ] テストカバレッジ 70% 以上
- [ ] デプロイ時間 10分以内
- [ ] ゼロダウンタイムデプロイ
- [ ] 自動セキュリティ監査

## 所要時間
約5日

## 必要なシークレット
- `EXPO_TOKEN`
- `STAGING_FIREBASE_AUTH_EMAIL/PASSWORD`
- `PROD_FIREBASE_AUTH_EMAIL/PASSWORD`
- `SLACK_WEBHOOK_URL`
- `GITHUB_TOKEN` (自動設定)
# DemoReception - デモ用簡易版QR受付アプリ

React.jsで構築されたPWA（Progressive Web App）対応の受付システムのデモ版です。GitHub Pagesで公開できるように設定されています。

## 🚀 特徴

- ✅ **PWA対応**: オフラインでも動作し、スマートフォンにインストール可能
- ✅ **レスポンシブデザイン**: PC・タブレット・スマートフォンに対応
- ✅ **GitHub Actions**: 自動ビルドとGitHub Pagesへのデプロイ
- ✅ **TypeScript**: 型安全な開発環境
- ✅ **Vite**: 高速な開発サーバーとビルドツール

## 🛠 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **PWA**: vite-plugin-pwa (Workbox)
- **デプロイ**: GitHub Actions + GitHub Pages

## 📦 セットアップ

### 前提条件
- Node.js 20以上
- npm

### インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build

# ビルドしたアプリをプレビュー
npm run preview
```

## 🚀 GitHub Pagesでの公開

このプロジェクトは自動的にGitHub Pagesにデプロイされるよう設定されています。

### 設定手順

1. **リポジトリ設定**
   - GitHubリポジトリの「Settings」→「Pages」へ移動
   - Source を「GitHub Actions」に設定

2. **自動デプロイ**
   - `main` ブランチにプッシュすると自動的にビルド・デプロイが実行されます
   - GitHub Actionsの「Deploy React PWA to GitHub Pages」ワークフローが実行されます

3. **アクセス**
   - デプロイ完了後、`https://[ユーザー名].github.io/DemoReception/` でアクセス可能

## 📱 PWA機能

- **オフライン対応**: Service Workerによりオフラインでも動作
- **インストール可能**: スマートフォンやPCにアプリとしてインストール可能
- **プッシュ通知**: 将来的な機能拡張に対応

## 🔧 開発

### ディレクトリ構造

```
DemoReception/
├── public/                 # 静的ファイル
│   ├── icon-192.svg       # PWAアイコン (192x192)
│   ├── icon-512.svg       # PWAアイコン (512x512)
│   └── vite.svg           # Viteロゴ
├── src/                   # ソースコード
│   ├── App.tsx           # メインアプリケーション
│   ├── App.css           # アプリスタイル
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml        # デプロイワークフロー
├── dist/                 # ビルド出力（自動生成）
├── vite.config.ts        # Vite設定
├── tsconfig.json         # TypeScript設定
└── package.json          # プロジェクト設定
```

### カスタマイズ

- **アプリ名・説明**: `vite.config.ts` の manifest 設定を変更
- **テーマカラー**: `vite.config.ts` の theme_color, background_color を変更
- **アイコン**: `public/` ディレクトリのSVGファイルを変更
- **ベースパス**: GitHub Pagesのリポジトリ名に合わせて `vite.config.ts` の base を変更

## 🎯 今後の拡張予定

- [ ] QRコードスキャン機能
- [ ] 受付者管理機能
- [ ] データベース連携
- [ ] 管理画面
- [ ] プッシュ通知機能

## 📄 ライセンス

ISC License

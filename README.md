# 🎨 Whiteboard (Flutter Web + Cloudflare Workers)

Flutter (Material Design 3 Expressive + `CustomPainter`) と Hono / Cloudflare Workers Static Assets で構築された、高速・マルチプラットフォーム対応のホワイトボードアプリケーションです。

---

## ✨ 主な機能

- ⚡ **Cloudflare Workers + Hono バックエンド**: Workers Static Assets で Flutter Web (Wasm / CanvasKit) を配信し、`/api/*` を Hono で処理
- 🖌️ **ベクター描画エンジン & 消しゴム**:
  - 2次ベジェ曲線補間と `ui.Picture` オフスクリーンキャッシュ＋ビューポートカリングによる高速描画
  - **黒 (Black)**: ライトテーマでは黒、**ダークテーマでは自動的に白**に切り替わります
  - 7色プリセット + 2D HSV カラーピッカー（マイカラー保存最大12色）
  - 線の太さ調整（`1px〜48px` スライダー & プリセット）
  - `BlendMode.dstOut` による背景グリッドを壊さない消しゴムツール
- 🔍 **無限キャンバス（パン & ズーム）**:
  - デスクトップ: 右/中ボタンドラッグでパン、ホイールでパン、`Ctrl/Cmd + ホイール` でカーソル中心ズーム
  - タッチ: 1本指で描画、2本指でパン＆ピンチズーム
- 🎨 **Material Design 3 Expressive**:
  - 5種類の動的カラーシード切り替え + ライト / ダークテーマ切り替え
- 🗂️ **マルチボード & IndexedDB 永続化**:
  - 複数ボードの作成・切替・名前変更・複製・削除
  - IndexedDB (`whiteboard_app_db`) へのデバウンス自動保存（既存データ・JSON バックアップ形式と互換）
  - JSON バックアップのエクスポート & インポート
- 💾 **PNG 画像エクスポート**:
  - 現在のホワイトボードを高解像度 PNG として保存
- 🤖 **Android アプリ (`.apk`)**:
  - サイト右上の Android アイコンから最新の `whiteboard.apk` ([GitHub Releases](https://github.com/maruniko1118/whiteboard/releases/latest/download/whiteboard.apk)) をダウンロード可能
  - `main` ブランチへのプッシュ時に GitHub Actions で自動ビルド＆リリース公開
- ⌨️ **ショートカットキー**:
  - `1`〜`7`: ペン色選択、`P`: ペン、`E`: 消しゴム、`[` / `]`: 線の太さ変更、`T`: テーマ切替
  - `Ctrl/Cmd + Z`: 元に戻す、`Ctrl/Cmd + Y` / `Ctrl/Cmd + Shift + Z`: やり直す、`Ctrl/Cmd + +/-/0`: ズーム操作

---

## 🚀 開発・ビルド・デプロイ方法

### 前提条件
- Node.js 24+
- Flutter SDK (stable)

### 1. 依存パッケージのインストール
```bash
npm install
cd flutter_app && flutter pub get
```

### 2. テスト・静的解析
```bash
npm run test:flutter
cd flutter_app && flutter analyze
npm run typecheck
```

### 3. 本番ビルド & ローカル確認
```bash
npm run build:flutter
npx wrangler dev
```

### 4. Android APK ビルド
```bash
cd flutter_app && flutter build apk --release
```

### 5. Cloudflare Workers へデプロイ
```bash
npm run deploy
```

---

## 📁 ディレクトリ構成

```
whiteboard/
├── src/
│   └── server.ts                  # Hono API (Cloudflare Workers)
├── flutter_app/
│   ├── android/                   # Android アプリ設定 (Whiteboard)
│   ├── lib/
│   │   ├── main.dart              # エントリーポイント & M3 Expressive テーマ適用
│   │   ├── models/                # BoardData / Stroke / AppStateData モデル
│   │   ├── services/              # IndexedDB / ファイル永続化・JSON/PNG I/O
│   │   ├── canvas/                # CustomPainter 描画エンジン & ジェスチャー処理
│   │   ├── theme/                 # M3 Expressive テーマ & 適応カラーパレット
│   │   └── widgets/               # TopAppBar, FloatingToolbar, ポップオーバー群
│   ├── test/                      # ユニット & ウィジェットテスト
│   └── web/                       # Web エントリー HTML / マニフェスト / アイコン
├── .github/workflows/deploy.yml   # GitHub Actions 自動テスト・Webデプロイ・APKリリース
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml                  # Workers Static Assets 設定 (flutter_app/build/web)
```

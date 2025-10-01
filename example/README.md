# LGaP_RECEPTION
- [LGaP\_RECEPTION](#lgap_reception)
  - [はじめに](#はじめに)
  - [アプリの構成](#アプリの構成)
    - [React Native Web](#react-native-web)
    - [Expo](#expo)
    - [webpack](#webpack)
    - [GitLab PAGES](#gitlab-pages)
    - [Firebase Realtime Database](#firebase-realtime-database)
    - [Amazon API Gateway](#amazon-api-gateway)
    - [AWS Lambda](#aws-lambda)
    - [Amazon Aurora](#amazon-aurora)
  - [開発に必要なツール類](#開発に必要なツール類)
  - [開発準備からビルドまで](#開発準備からビルドまで)
    - [1.ソースファイルをチェックアウト](#1ソースファイルをチェックアウト)
    - [2.nodeモジュールのインストール](#2nodeモジュールのインストール)
    - [3.Expoの起動](#3expoの起動)
    - [4.WEBアプリ向けビルドの実行](#4webアプリ向けビルドの実行)
    - [5.iPadでの実行](#5ipadでの実行)
  - [WEBビルド・実行](#webビルド実行)
    - [1.ソースファイルをチェックアウト](#1ソースファイルをチェックアウト-1)
    - [2.nodeモジュールのインストール](#2nodeモジュールのインストール-1)
    - [3.ビルド](#3ビルド)
    - [4.起動](#4起動)
    - [5.実行](#5実行)
  - [クラウドサービスにホスティング](#クラウドサービスにホスティング)
    - [GitLab](#gitlab)
    - [GitLab Pages](#gitlab-pages-1)
      - [LGaP\_RECEPTION用](#lgap_reception用)
      - [LGaP\_RECEPCORE用](#lgap_recepcore用)
      - [なんでも検証用](#なんでも検証用)
    - [1.ソースファイルをチェックアウト](#1ソースファイルをチェックアウト-2)
    - [2.ソースファイルの更新](#2ソースファイルの更新)
    - [3.GitLabへアップロード](#3gitlabへアップロード)
    - [4.自動ビルド](#4自動ビルド)
    - [5.アプリへアクセス](#5アプリへアクセス)
    - [6.PWAとして使用する（iPad）](#6pwaとして使用するipad)
  - [その他資料](#その他資料)

---

## はじめに
LGaP_APPの機能「自己QR」を利用した受付アプリです。iPadで使用することを想定しています。<br>
受付アプリは2種類あり、役割が異なります。<br>

- LGaP_RECEPTION
    - 読み：えるぎゃっぷ_れせぷしょん　通称：れせぷち
    - 受付の窓口にiPadを置き、来場者が自己QRを読みと取らせて受付を行います
    - 自己QRを使わずに受付することも可能です
    - セッティング作業を除き、主に来場者が使うことを想定しています
- LGaP_RECEPCORE         
    - 読み：えるぎゃっぷ_れせぷこあ　通称：れせぷこ
    - LGaP_RECEPTIONで受け付けたデータの確認や集計を行います
    - 自治体職員が操作することを想定しています

2種類に分かれていますが、2つで1つのアプリです。

---

## アプリの構成

![システム構成図](./README_images/SystemConfigurationDiagram.jpg)

### React Native Web
モバイルアプリ用フレームワークであるReact Nativeですが、それを更にWEBアプリに対応させたフレームワークです。開発言語としてはJavaScript・TypeScriptです。ネイティブアプリだとアプリの配布に開発者・ユーザー共に手間が掛かるので、WEBブラウザで楽にアクセスできるアプリを目指して採用されました。

### Expo
React Nativeアプリを開発するためのSDKです。主に開発時のアプリのビルド、実行に使用します。<br>
iOSエミュレーター（Macで開発時のみ）、Androidエミュレーター、ネイティブアプリ的にスマホ・タブレットでの実行（Expo Go）、WEBブラウザので実行を備えた優れものですが、PWA化やSDKバージョンの関係等で実質的にはWEBブラウザの実行のみが使えます。<br>
また、OTAアップデートという機能を備えており、もしネイティブアプリとして開発していればアプリリリースを簡素化できた可能性があります。<br>
<br>
また、おそらく万博とは関係ありません。

### webpack
モジュールをバンドル（束にする、包む）するものです。PWA（Progressive Web Apps）化するためにService Workerを使用しており、それとセットで利用しています（理屈はよくわかっていません）<br>
PWA化することで、実際はWEBブラウザで動いているのに、ネイティブアプリのように動作することができます。

### GitLab PAGES
アプリをホスティングしています。WEBブラウザからURLへアクセスすることでアプリが利用できます。<br>
開発の都合上、利用実績のあったGitLab PAGESを使用していますが、別のクラウドサービス等を利用することも可能だと思われます。実際に導入する場合には検討が必要です。

### Firebase Realtime Database
ログインユーザーの管理・認証をしています。LGaP_BASEの実装をそのまま流用しているので、「/baseMember」ノードに登録されているユーザーが利用できます。<br>
開発を簡素化するために採用していますが、FirebaseとAWS、2社のクラウドサービスを利用しているので将来的にAWS一本に絞るべきものだと思われます。LGaP全体のAWS移行を踏まえて検討する必要があります。<br>
また、ユーザーの所属部署や機能の利用権限についても追加で実装が求められています。

### Amazon API Gateway
アプリとAWSを橋渡ししています。AWS Lambdaとセットで用いられることが多いようです。

### AWS Lambda
Amazon RDSへクエリを投入し、その結果を返します。

### Amazon Aurora
フルマネージドデータベースサービスです。中身としてはPostgreSQL互換のデータベースです。検索や集計を行うことを想定してリレーショナルデータベースを採用しています。<br>
開発環境では最低限のスペックで構築しています。

> [!IMPORTANT]
> AWSの権限はITインフラ部が管理しています。アクセスする必要があれば、ITインフラにお問い合わせください。「川口と同じ権限ください」で通じるかも。

> [!CAUTION]
> Amazon RDS(Aurora)は、データベースのインスタンスを起動しているだけでクラウド利用料金が発生するため、平日の日中など使用する時間のみ手動で起動・停止しています。しかし、インスタンスを停止してもAmazon RDSの仕様によって7日後に自動でインスタンスが起動します（これはAmazon RDSがフルマネージドサービスであることに起因するものと思われます。）。7日後に自動起動してしまってもそれをさらに自動で停止するなどの方法が可能だと考えられますが、詳しい調査には至っていません。ITインフラ部の担当者と相談が必要です。

> [!CAUTION]
> AWSの利用料金はITインフラ部の予算内で精算していただいています。費用が膨らむようであれば、開発部署で別途予算を採るなどの検討が必要です。

---

## 開発に必要なツール類
2024.6.21時点で利用しているものを示します。古いバージョンが記載されているものがありますが、最新版をいちいち確認していないだけなのでアプリが動くのであれば最新版を利用すればいいと思います。

| #|ツール           |バージョン|メモ|
|-:|-----------------|---------|----|
|1|Node.js           |v20.10.0 |
|2|Git               |v2.40.1  |
|3|Visual Studio Code|v1.78.2  |
|4|pgAdmin 4         |v8.6     |PostgreSQLが扱えるクライアントソフトなら何でもOK
|5|iPad Pro(第2世代) |v17.5.1  |国際事業部でiPad 第10世代をターゲットに開発してもらった。LGaPチームではありあわせのものを使った。

## 開発準備からビルドまで
### 1.ソースファイルをチェックアウト
~~~
git clone https://github.com/mec-pubsys/LGaP_RECEPTION.git
~~~

### 2.nodeモジュールのインストール
~~~
npm i
~~~

### 3.Expoの起動
~~~
npx expo start
~~~

### 4.WEBアプリ向けビルドの実行
~~~
w
~~~

ここまで実行すると、規定のWEBブラウザでアプリが起動します。<br>
WEBブラウザでの開発も可能ですが、見た目の最終確認はiPadで行う必要があります。

### 5.iPadでの実行
iPadでSafariを起動し、URLに以下を入力します。<br>
　IPアドレス（PCのIPアドレス）（コンソールに表示されます）<br>
　　＋<br>
　WEB実行用のポート番号（規定：19006）（コンソールに表示されます）
~~~
例
http://10.99.250.128:19006
~~~

> [!IMPORTANT]
> ビルドを実行しているPCとiPadは同じ無線ネットワークに所属している必要があります。例えば社内Wi-Fi環境であるmec060です。<br>
> 有線接続のデスクトップPCと無線接続のiPadでは利用できません。

> [!NOTE]
> 基本的な開発時はこのビルド・実行方法で事足りますが、カメラなどの一部特殊な機能を用いている箇所は動かない場合があります。その場合は次の実行手順を使います。

## WEBビルド・実行
ローカルでWEBホスティングをするような形式で、本番に少し近い形です。しかし、結局はiPadで動かすことができず（方法があれば知りたい）、PCでの実行のみになるのであまり使う機会はないかもしれません。

### 1.ソースファイルをチェックアウト
~~~
前手順と同様
~~~

### 2.nodeモジュールのインストール
~~~
npm i
~~~

### 3.ビルド
~~~
npx expo export:web
~~~

### 4.起動
~~~
npx serve web-build
~~~

### 5.実行
コンソールに表示されたURLにWEBブラウザでアクセスします。
~~~
例
http://localhost:3000
http://192.168.137.1:3000
~~~

> [!NOTE]
> IPアドレスが入ったURLが表示されるのでiPadのSafariでアクセスできると思いきやできませんでした。

## クラウドサービスにホスティング
本番で想定している実行形式です。開発ではGitLabのPagesというサービスを利用しています。ホスティングしてしまうと開発用ビルドと違ってデバッグ機能等は使えないので、最終確認としてこの方法をとります。

### GitLab
無料ライセンスを利用しているので、5アカウントまでしか利用できません。開発メンバーの増減に合わせてアカウントの削除・追加を行う必要があります。GitHub Pagesなど他のサービスに乗り換えるのも良いかもしれません。

### GitLab Pages
3つの環境を使用して開発しています。ホストされたURL（アプリの実行環境）へはPC及びiPadからWEBブラウザでアクセスします。

#### LGaP_RECEPTION用
- プロジェクトのURL
    - https://gitlab.com/mec_selfqr/lgap_reception_pages
- ホストされたURL
    - https://lgap-reception-pages-mec-selfqr-148543011c509485190aa2323b0b398.gitlab.io

#### LGaP_RECEPCORE用
- プロジェクトのURL
    - https://gitlab.com/mec_selfqr/lgap_recepcore_pages
- ホストされたURL
    - https://lgap-recepcore-pages-mec-selfqr-f0ce1a852d87c64b98d586279b7139a.gitlab.io

#### なんでも検証用
最初に作った環境ですが、LGaP_RECEPTION用とLGaP_RECEPCORE用の環境をあとから作ったので余ってしまった環境です。検証用として残してありますが、潰してしまっても問題ないと思われます。
- プロジェクトのURL
    - https://gitlab.com/mec_selfqr/mec_selfqr_reader_releaseVer
- ホストされたURL
    - https://mec-selfqr-releasever-mec-selfqr-e26704473c1a1f5e9ca4c0467fac31.gitlab.io
 



### 1.ソースファイルをチェックアウト
~~~
git clone https://github.com/mec-pubsys/LGaP_RECEPTION.git
git clone https://gitlab.com/mec_selfqr/lgap_reception_pages
~~~

### 2.ソースファイルの更新
チェックアウトしたLGaP_RECEPTIONのソースファイルをコピーし、<br>
チェックアウトしたlgap_reception_pagesのフォルダに貼り付け（上書きし）ます。

### 3.GitLabへアップロード
チェックアウトしたlgap_reception_pagesフォルダをVisual Studio Codeで開きます。上書きしたファイルが差分として表示されるので、コミットとプッシュを実行します。

### 4.自動ビルド
GitLabプロジェクトのURLを開き、「パイプライン」が実行されていることを確認します。5～6分程度で完了します。

### 5.アプリへアクセス
自動ビルドが完了後、ホストされたURLにWEBブラウザでアクセスするとアプリが動作します。PC・iPad共にアクセス可能です。

### 6.PWAとして使用する（iPad）
ホストされたURLにSafariでアクセスするだけだと、単純にWEBブラウザでアクセスしているだけです。以下の手順を行うことでネイティブアプリのように動作します。

~~~
1.メニューバーの [↑□] アイコン（追加・共有・保存）アイコンをタップする
2.「ホーム画面に追加」をタップする
3.「追加」をタップする（名前は任意）
4.ホーム画面にアイコンが追加されるので、それをタップする
~~~

---

## その他資料
https://matsusaka.sharepoint.com/sites/LGaP/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FLGaP%2FShared%20Documents%2F%E8%87%AA%E5%B7%B1QR%E5%8F%97%E4%BB%98%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%EF%BC%88LGaP%5FRECEPTION%EF%BC%8FRECEPCORE%EF%BC%89
# Grunt Checker - デスボイス測定アプリ
[![Rails](https://img.shields.io/badge/Rails-v6.1.7.2-CC0000)](https://rubygems.org/gems/rails/versions/6.1.7.2)

### https://www.gruntchecker.com

![gruntchecker_ogp](https://raw.githubusercontent.com/snrrrns/grunt_checker/main/app/assets/images/ogp.png)

## サービス概要
### 3行で
デスボイスを録音し  
その音声をバンドの演奏と合成して聴くことができ  
採点までするアプリです。

## メインのターゲットユーザー
- デスボイスを出してみたい人
- デスボイスを使うようなバンドのボーカリストになったような体験をしてみたい人

## ユーザーが抱える課題
- デスボイスを出してみたいが踏み出せない・恥ずかしい
- デスボイスをバンドに合わせて歌う機会がない

## 解決方法
- お手本のデスボイスを用意し、歌い方の例をユーザーに示して後押しする
- 録音したデスボイスと、デスメタルなどの演奏とを合成した音声を作成し、自分がバンドに混ざったかのような疑似体験を提供
- 録音した音声の採点も行い、上達への意欲やモチベーション向上を促進

## 機能
- 音声合成機能  
  - ユーザーが録音した音声とあらかじめ用意した演奏データを合成し、一つの楽曲を生成する。
- 音声採点機能  
  - 音声から感情分析をする外部APIを導入。デスボイスで歌うと強く出る感情があり、それを基準に音声を採点する。
- Twitterシェア機能  
  - 採点した得点をTwitterにシェアすることが可能。

## 使用技術
### バックエンド
- Ruby 3.0.2
- Rails 6.1.7.2

### フロントエンド
- JavaScript
- TypeScript

### 音声録音・合成処理
- MediaStream Recording API
- Web Audio API

### 外部API
- User Local 音声感情認識AI

### DB
- PostgreSQL

### ストレージ
- Amazon S3

### PaaS
- Fly.io

## なぜこのサービスを作ったのか？
デスボイスのある音楽の魅力を、体験しながら知ってほしい為です。   
私はデスメタルなどのエクストリームな音楽が好きで、そのようなジャンルのバンドへの所属や、作曲の経験があります。  
上記の音楽は非常に過激・攻撃的で、その"極端さ"に私は10代から今に至るまでずっと魅了され続けています。しかし、国内においては認知度が低く、好んで聴くリスナーは多くありません。  
そのため、これらの音楽のかっこよさ・楽しさを、アプリを通して一人でも多く体験してもらえればと思い作成を決めました。  
このアプリだけでデスボイスを上達させることは難しいですが、「上達してみたい」「もっと知ってみたい」と思い立つきっかけになればいいなと考えています。 

## 画面遷移図
https://www.figma.com/file/BJZpS1i2GUY9fLg6sDuOPW/%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?node-id=0%3A1

## ER図
https://drive.google.com/file/d/1itWRmLiMyQB8WKB3Bo0EkzQMqNxfbwkR/view?usp=sharing

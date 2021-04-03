<div align="center">
<img src="https://camo.githubusercontent.com/40a80c83c5ce6ff286d0693ebe6b736cdcce8c94b22e3cd1b56ef5904733da8e/68747470733a2f2f6173736574732e737469636b706e672e636f6d2f696d616765732f3538306235376663643939393665323462633433633534332e706e67" alt="self-bot-colongan" width="300" />

# SelfBotColongan

>
>
>

<p align="center">
  <a href="https://github.com/dngda"><img title="Author" src="https://img.shields.io/badge/Author-dngda-red.svg?style=for-the-badge&logo=github" /></a>
</p>

<p align="center">
  <a href="https://github.com/dngda/self-bot-colongan#requirements">Requirements</a> •
  <a href="https://github.com/dngda/self-bot-colongan#instalasi">Installation</a> •
  <a href="https://github.com/dngda/self-bot-colongan#features">Features</a> •
  <a href="https://github.com/dngda/self-bot-colongan#thanks-to">Thanks to</a>
</p>
</div>


---



# Requirements
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads)
* [FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2020-12-08-13-03/ffmpeg-n4.3.1-26-gca55240b8c-win64-gpl-4.3.zip)
* [Libwebp](https://developers.google.com/speed/webp/download)
* Any text editor

# Instalasi
## Clone Repo & Instalasi dependencies
```bash
> git clone https://github.com/dngda/self-bot-colongan.git
> cd self-bot-colongan
> npm install
> node xinz
```
## For Termux
```bash
> termux-setup-storage
> apt update && apt upgrade
> pkg install nodejs
> pkg install git
> pkg install bash
> git clone https://github.com/dngda/self-bot-colongan.git
> cd self-bot-colongan
> bash install.sh
> npm install
> node index
```

## Edit file
- Change menu [disini](https://github.com/dngda/self-bot-colongan/blob/master/index.js#95)
- Change prefix [disini](https://github.com/dngda/self-bot-colongan/blob/master/index.js#35)
- Change faketeks [disini](https://github.com/dngda/self-bot-colongan/blob/master/index.js#33)
- Change gambar [disini](https://github.com/dngda/self-bot-colongan/blob/master/media/wa.jpg) di replace gambar nya dan jangan diubah namanya
- Bisa juga ganti biar jadi forwarded message
```js
aqul.sendFakeStatus(from, teks, fake)
// bisa diubah menjadi
aqul.FakeStatusForwarded(from, teks, fake)

aqul.sendFakeStatusWithImg(from, image, caption, faketeks)
// bisa diubah menjadi
aqul.FakeStatusImgForwarded(from, image, caption, faketeks)

aqul.sendFakeToko(from, teks, fake)
// bisa diubah menjadi
aqul.FakeTokoForwarded(from, teks, fake)
```

## Installing the FFmpeg
* Unduh salah satu versi FFmpeg yang tersedia dengan mengklik [di sini](https://www.gyan.dev/ffmpeg/builds/).
* Extract file ke `C:\` path.
* Ganti nama folder yang telah di-extract menjadi `ffmpeg`.
* Run Command Prompt as Administrator.
* Jalankan perintah berikut::
```cmd
> setx /m PATH "C:\ffmpeg\bin;%PATH%"
```
Jika berhasil, akan memberikanmu pesan seperti: `SUCCESS: specified value was saved`.
* Sekarang setelah Anda menginstal FFmpeg, verifikasi bahwa itu berhasil dengan menjalankan perintah ini untuk melihat versi:
```cmd
> ffmpeg -version
```


## Installing the libwebp
* Unduh salah satu versi libwebp yang tersedia dengan mengklik [di sini](https://developers.google.com/speed/webp/download).
* Extract file ke `C:\` path.
* Ganti nama folder yang telah di-extract menjadi `libwebp`.
* Run Command Prompt as Administrator.
* Jalankan perintah berikut::
```cmd
> setx /m PATH "C:\libwebp\bin;%PATH%"
```
Jika berhasil, akan memberikanmu pesan seperti: `SUCCESS: specified value was saved`.
* Sekarang setelah Anda menginstal libwebp, verifikasi bahwa itu berhasil dengan menjalankan perintah ini untuk melihat versi:
```cmd
> webpmux -version
```

## Menjalankan bot
```bash
> node index
atau bisa juga
> npm start
```

 Setelah itu, akan ada QR-CODE, buka WhatsApp-mu yg ingin dijadikan bot, lalu scan code-qr nya!

## Bot Tidak jalan
- Jika bot tidak jalan, coba ganti versi baileys
```bash
> npm i @adiwajshing/baileys@3.4.1
> atau
> npm i @adiwajshing/baileys@3.3.0
```
- Serah aja 

# Features

| Menu nya dikit |✅|
| ------------- | ------------- |
| Sticker WM|✅|
| Costum WM|✅|
| TakeSticker|✅|
| Switch Self Public|✅|
| Hidetag|✅|
| Runtime|✅|
| Speed|✅|
| Set Reply|✅|
| Set Prefix|✅|
| Set Name|✅|
| Set Bio|✅|
| Fake Deface|✅|
| Fake Thumbnail|✅|
| Set thumb|✅|
| Get pic|✅|
| Sticker Tag|✅|
| Image Tag|✅|
| Kontak Tag|✅|
| Forwarded Message|✅|
| Eval|✅|

# Thanks to
* [`Baileys`](https://github.com/adiwajshing/Baileys)
* [`MhankBarBar`](https://github.com/MhankBarBar)
* [`SlavyanDesu`](https://github.com/SlavyanDesu)
* [`VideFrelan`](https://github.com/VideFrelan)
* [`TobyG74`](https://github.com/TobyG74)
* [`Mamet`](https://github.com/mamet8/)
* [`DhyZx`](https://github.com/dhyZx)
* [`Aqulzz`](https://github.com/zennn08)

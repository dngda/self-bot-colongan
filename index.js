const
	{
		WA_MESSAGE_STUB_TYPES,
		WA_DEFAULT_EPHEMERAL,
		GroupSettingChange,
		WALocationMessage,
		MessageOptions,
		ReconnectMode,
		WAConnection,
		mentionedJid,
		MessageType,
		processTime,
		ProxyAgent,
		waChatKey,
		Mimetype,
		Presence
} = require("@adiwajshing/baileys")

const fs = require("fs")
const mess = JSON.parse(fs.readFileSync('./whatsapp/mess.json'))
const conn = require('./whatsapp/connect')
const wa = require('./whatsapp/message.js')
const moment = require("moment-timezone")
const { color } = require('./lib/color')
const { exec } = require('child_process')
const speed = require('performance-now')
const ffmpeg = require('fluent-ffmpeg')
const Exif = require('./lib/exif')
const axios = require('axios')
const exif = new Exif()

conn.connect()
const client = conn.client

fake = 'Self Bot Colongan'
fakeimage = fs.readFileSync(`./media/wa.jpeg`)
prefix = '?'
public = false

client.on('message-new', async(msg) => {
    try {
        if (!msg.message) return
		if (msg.key && msg.key.remoteJid == 'status@broadcast') return

        global.prefix
		const content = JSON.stringify(msg.message)
		const from = msg.key.remoteJid
		const type = Object.keys(msg.message)[0]
		const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
		body = (type === 'conversation' && msg.message.conversation.startsWith(prefix)) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption.startsWith(prefix) ? msg.message.imageMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption.startsWith(prefix) ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text.startsWith(prefix) ? msg.message.extendedTextMessage.text : ''
		chats = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
		const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
		const args = body.trim().split(/ +/).slice(1)
		const isCmd = body.startsWith(prefix)
		const arg = chats.slice(command.length + 2, chats.length)
		const ucapan = await axios.get('https://xinzbot-api.herokuapp.com/api/ucapan?apikey=clientBot&timeZone=Asia/Jakarta')

        const botNumber = client.user.jid
		const isGroup = from.endsWith('@g.us')
		const sender = msg.key.fromMe ? client.user.jid : isGroup ? msg.participant : msg.key.remoteJid
		const totalchat = await client.chats.all()
		const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupDesc = isGroup ? groupMetadata.desc : ''
		const groupAdmins = isGroup ? wa.getGroupAdmins(groupMembers) : ''
		const groupOwner = isGroup ? groupMetadata.owner : ''
		const itsMe = sender === botNumber ? true : false
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
		}

        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
		if (itsMe){
			if (chats.toLowerCase() === `${prefix}self`){
				public = false
				wa.sendFakeStatus(from, `Sukses`, `Status: SELF`)
			}
			if (chats.toLowerCase() === 'status'){
				wa.sendFakeStatus(from, `STATUS: ${public ? 'PUBLIC' : 'SELF'}`)
			}
		}
		if (!public){
			if (!msg.key.fromMe) return
		}
		if (isCmd && !isGroup) {console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))}
        if (isCmd && isGroup) {console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(client.user.name), 'in', color(groupName))}
        switch (command) {
			case 'menu': case 'help':
				textnya = `Hallo semua, *${ucapan.data.result}*

- ${prefix}sticker
- ${prefix}swm nama | author
- ${prefix}takestick nama | author
- ${prefix}colong <reply stiker>

- ${prefix}runtime
- ${prefix}speed
- ${prefix}mystat
- ${prefix}kontak
- ${prefix}term

- ${prefix}setreply
- ${prefix}setprefix
- ${prefix}setname
- ${prefix}setbio

- ${prefix}fdeface
- ${prefix}fakethumbnail
- ${prefix}setthumb
- ${prefix}getpic

- ${prefix}stickertag
- ${prefix}kontaktag
- ${prefix}hidetag
- ${prefix}imgtag

- ${prefix}public
- ${prefix}self


- status
- > <eval>

Dah itu doang.`
				wa.sendFakeStatusWithImg(from, fakeimage, textnya, fake)
				break
            case 'test':
                wa.sendText(from, 'oke')
				break
			case 'public':
				public = true
				wa.sendFakeStatus(from, `Status: PUBLIC`, fake)
				break
			case 'exif':
				if (args.length < 1) return wa.reply(from, `Penggunaan ${prefix}exif nama|author`, msg)
				if (!arg.split('|')) return wa.reply(from, `Penggunaan ${prefix}exif nama|author`, msg)
				exif.create(arg.split('|')[0], arg.split('|')[1])
				wa.reply(from, 'sukses', msg)
				break
			case 'sticker':
			case 'stiker':
			case 's':
				if (isMedia && !msg.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								wa.reply(from, mess.error.api, msg)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return wa.reply(from, mess.error.api, msg)
									wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)
									fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					wa.reply(from, mess.wait, msg)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								wa.reply(from, mess.error.api, msg)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return wa.reply(from, mess.error.api, msg)
									wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)
									fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else {
					wa.reply(from, `Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`, msg)
				}
				break
			case 'swm':
			case 'stickerwm':
				if (isMedia && !msg.message.videoMessage || isQuotedImage) {
					if (!arg.includes('|')) return wa.reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, msg)
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								wa.reply(from, mess.error.api, msg)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return wa.reply(from, mess.error.api, msg)
									wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)
									fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
									fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					if (!arg.includes('|')) return wa.reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, msg)
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					wa.reply(from, mess.wait, msg)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								wa.reply(from, mess.error.api, msg)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return wa.reply(from, mess.error.api, msg)
									wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)									
									fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
									fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else {
					reply(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
				}
				break
			case 'takestick':
				if (!isQuotedSticker) return wa.reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, msg)
				const pembawm = body.slice(11)
				if (!pembawm.includes('|')) return wa.reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, msg)
				const encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
				const packname = pembawm.split('|')[0]
				const author = pembawm.split('|')[1]
				exif.create(packname, author, `takestick_${sender}`)
				exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return wa.reply(from, mess.error.api, msg)
					wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)
					fs.unlinkSync(media)
					fs.unlinkSync(`./sticker/takestick_${sender}.exif`)
				})
				break
			case 'colong':
				if (!isQuotedSticker) return wa.reply(from, `Reply sticker dengan caption *${prefix}colong*`, msg)
				const encmediia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				const meidia = await client.downloadAndSaveMediaMessage(encmediia, `./sticker/${sender}`)
				exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return wa.reply(from, mess.error.api, msg)
					wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), msg)
					fs.unlinkSync(meidia)
				})
				break
			case 'hidetag':
				if (!arg) return wa.reply(from, `Penggunaan ${prefix}hidetag teks`, msg)
				wa.hideTag(from, arg)
				break
			case 'runtime':
				run = process.uptime()
				let text = wa.runtime(run)
				wa.sendFakeStatus(from, text, `Runtime bro`)
				break
			case 'speed': case 'ping':
				let timestamp = speed();
				let latensi = speed() - timestamp
				wa.sendFakeStatus(from, `Speed: ${latensi.toFixed(4)}second`, fake)
				break
			case 'mystat': case 'mystatus':
				let i = []
				let giid = []
				for (mem of totalchat){
					i.push(mem.jid)
				}
				for (id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = client.user.phone
                anu = process.uptime()
                teskny = `*V. Whatsapp :* ${wa_version}
*RAM :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*MCC :* ${mcc}
*MNC :* ${mnc}
*Versi OS :* ${os_version}
*Merk HP :* ${device_manufacturer}
*Versi HP :* ${device_model}

*Group Chat :* ${giid.length}
*Personal Chat :* ${totalchat.length - giid.length}
*Total Chat :* ${totalchat.length}
*Speed :* ${latensii.toFixed(4)} Second
*Runtime :* ${wa.runtime(anu)}`
				wa.sendFakeStatus(from, teskny, fake)
				break
			case 'kontak':
				argz = arg.split('|')
				if (!argz) return wa.reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, msg)
				if (msg.message.extendedTextMessage != undefined){
                    mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
					wa.sendKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					wa.sendKontak(from, argz[0], argz[1])
				}
				break
			case 'term':
				if (!arg) return
				exec(arg, (err, stdout) => {
					if (err) return wa.sendFakeStatus(from, err, fake)
					if (stdout) wa.sendFakeStatus(from, stdout, fake)
				})
				break
			case 'setreply':
				if (!arg) return wa.reply(from, `Penggunaan ${prefix}setreply teks`, msg)
				fake = arg
				wa.sendFakeStatus(from, `Sukses`, fake)
				break
			case 'setprefix':
				if (!arg) return wa.reply(from, `Penggunaan ${prefix}setprefix prefix`, msg)
				prefix = arg
				wa.sendFakeStatus(from, `Prefix berhasil diubah menjadi ${prefix}`, fake)
				break
			case 'setname':
				if (!arg) return wa.reply(from, 'masukkan nama', msg)
				wa.setName(arg)
				.then((res) => wa.sendFakeStatus(from, JSON.stringify(res), fake))
				.catch((err) => wa.sendFakeStatus(from, JSON.stringify(err), fake))
				break
			case 'setbio':
				if (!arg) return wa.reply(from, 'masukkan bio', msg)
				wa.setBio(arg)
				.then((res) => wa.sendFakeStatus(from, JSON.stringify(res), fake))
				.catch((err) => wa.sendFakeStatus(from, JSON.stringify(err), fake))
				break
			case 'fdeface': case 'hack':
				if (!arg) return wa.reply(from, `Penggunaaan ${prefix}fdeface url|title|desc|bawahnya`, msg)
				argz = arg.split("|")
				if (!argz) return wa.reply(from, `Penggunaaan ${prefix}fdeface url|title|desc|bawahnya`, msg)
				if ((isMedia && !msg.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					let media = await client.downloadMediaMessage(encmedia)
					wa.sendFakeThumb(from, argz[0], argz[1], argz[2], argz[3], media)
				} else {
					wa.sendFakeThumb(from, argz[0], argz[1], argz[2], argz[3])
				}
				break
			case 'fakethumbnail': case 'fthumbnail': case 'fakethumb':
				if ((isMedia && !msg.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					let media = await client.downloadMediaMessage(encmedia)
					wa.sendFakeImg(from, media, arg, fakeimage, msg)
				} else {
					wa.reply(from, `Kirim gambar atau reply dengan caption ${prefix}fakethumb caption`, msg)
				}
				break
			case 'setthumb':
				boij = JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await client.downloadMediaMessage(boij)
				fs.writeFileSync(`./media/wa.jpeg`, delb)
				wa.sendFakeStatus(from, `Sukses`, fake)
				break
			case 'getpic':
				if (msg.message.extendedTextMessage != undefined){
					mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
					try {
						pic = await client.getProfilePicture(mentioned[0])
					} catch {
						pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
					}
					thumb = await wa.getBuffer(pic)
					client.sendMessage(from, thumb, MessageType.image)
				}
				break
			case 'imgtag':
				if ((isMedia && !msg.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					let media = await client.downloadMediaMessage(encmedia)
					wa.hideTagImg(from, media)
				} else {
					wa.reply(from, `Kirim gambar atau reply dengan caption ${prefix}imgtag caption`, msg)
				}
				break
			case 'sticktag': case 'stickertag':
				if (!isQuotedSticker) return wa.reply(from, `Reply sticker dengan caption *${prefix}stickertag*`, msg)
				let encmediai = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				let mediai = await client.downloadMediaMessage(encmediai)
				wa.hideTagSticker(from, mediai)
				break
			case 'kontaktag':
				argz = arg.split('|')
				if (!argz) return wa.reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, msg)
				if (msg.message.extendedTextMessage != undefined){
                    mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
					wa.hideTagKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					wa.hideTagKontak(from, argz[0], argz[1])
				}
				break
			default:
				if (chats.startsWith('>')){
					console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Eval brooo`))
                	return wa.reply(from, JSON.stringify(eval(chats.slice(2)), null, 2), msg)
				}
				break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
})
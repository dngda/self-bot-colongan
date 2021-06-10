import baileys, {
	WA_MESSAGE_STUB_TYPES,
	WA_DEFAULT_EPHEMERAL,
	GroupSettingChange,
	ReconnectMode,
	WAConnection,
	MessageType,
	ProxyAgent,
	waChatKey,
	Mimetype,
	Presence
} from '@adiwajshing/baileys'

const { processTime, mentionedJid, MessageOptions, WALocationMessage } = baileys

import fs from "fs"
const { readFileSync, unlinkSync, writeFileSync } = fs

const mess = JSON.parse(readFileSync('./whatsapp/mess.json'))
import { connect, client } from './whatsapp/connect.js'
import {
	sendFakeStatusWithImg,
	getGroupAdmins,
	sendFakeStatus,
	hideTagSticker,
	hideTagKontak,
	sendSticker,
	sendFakeImg,
	sendKontak,
	hideTagImg,
	getBuffer,
	sendText,
	hideTag,
	runtime,
	setName,
	setBio,
	reply
} from './whatsapp/message.js'
import moment from "moment-timezone"
moment.tz.setDefault('Asia/Jakarta').locale('id')
import { color } from './lib/color.js'
import simple from './lib/simple.cjs'
import { exec } from 'child_process'
import speed from 'performance-now'
import ffmpeg from 'fluent-ffmpeg'
import Exif from './lib/exif.js'
import axios from 'axios'
const exif = new Exif()

connect()

let fake = 'Self Bot Colongan'
let fakeimage = readFileSync(`./media/wa.jpeg`)
let prefix = '!!'
let publicMode = false

client.on('chat-update', async (chatUpdates) => {
	// received a new message
    if (!chatUpdates.hasNewMessage) return
    if (!chatUpdates.messages && !chatUpdates.count) return
    let m = chatUpdates.messages.all()[0]
	simple.smsg(client, m)

	try {
		if (!m.message) return
		if (m.key && m.key.remoteJid == 'status@broadcast') return

		global.prefix
		const content = JSON.stringify(m.message)
		const from = m.key.remoteJid
		const type = m.mtype
		// const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		const body = (type === 'extendedTextMessage' || type === 'conversation') && m.text.startsWith(prefix) ? m.text : ''
		const chats = (type === 'extendedTextMessage' || type === 'conversation') ? m.text : ''
		const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
		const arg = body.replace(prefix + command, '').trim()
		const args = arg.split(/\s/)
		const isCmd = body.startsWith(prefix)
		const botNumber = client.user.jid
		const isGroup = m.isGroup
		const sender = m.sender
		const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const itsMe = sender === botNumber ? true : false
		// const totalchat = client.chats.all()
		// const groupId = isGroup ? groupMetadata.jid : ''
		// const groupMembers = isGroup ? groupMetadata.participants : ''
		// const groupDesc = isGroup ? groupMetadata.desc : ''
		// const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		// const groupOwner = isGroup ? groupMetadata.owner : ''
		// const isUrl = (url) => {
		// 	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
		// }

		const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

		if (itsMe) {
			if (chats.toLowerCase() === `self`) {
				publicMode = false
				sendFakeStatus(from, `Sukses`, `Status: SELF (Prefix ${prefix})`)
			}
			else if (chats.toLowerCase() === `public`) {
				publicMode = true
				sendFakeStatus(from, `Sukses`, `Status: PUBLIC (Prefix ${prefix})`)
			}
			else if (chats.toLowerCase() === 'status') {
				sendFakeStatus(from, `Online`, `Status: ${publicMode ? 'PUBLIC' : 'SELF'} (Prefix ${prefix})`)
			}
		}

		if (!publicMode) {
			if (!m.key.fromMe) return
		}
		if (isCmd && !isGroup) { console.log(color('[CMD]'), color(moment(m.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`)) }
		if (isCmd && isGroup) { console.log(color('[CMD]'), color(moment(m.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(client.user.name), 'in', color(groupName)) }
		switch (command) {
			case 'menu': case 'help':
				let textnya = `Hallo guys

- ${prefix}sticker
- ${prefix}swm nama | author
- ${prefix}takestick nama | author
- ${prefix}colong (reply stiker)

- ${prefix}runtime
- ${prefix}speed
- ${prefix}kontak

- ${prefix}setreply
- ${prefix}setprefix
- ${prefix}setname
- ${prefix}setbio

- ${prefix}fakethumbnail
- ${prefix}setthumb
- ${prefix}getpic

- ${prefix}stickertag
- ${prefix}kontaktag
- ${prefix}hidetag
- ${prefix}imgtag

- status
- self/public
- > (return)
- >> (eval)
- = (term)
`
				sendFakeStatusWithImg(from, fakeimage, textnya, fake)
				break
			case 'test':
				sendText(from, 'Oke mantap')
				break
			case 'exif':
				if (args.length < 1) return reply(from, `Penggunaan ${prefix}exif nama|author`, m)
				if (!arg.split('|')) return reply(from, `Penggunaan ${prefix}exif nama|author`, m)
				exif.create(arg.split('|')[0], arg.split('|')[1])
				reply(from, 'sukses', m)
				break
			case 'sticker':
			case 'stiker':
			case 's':
				if (isMedia && !m.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					ffmpeg(`${media}`)
						.input(media)
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							unlinkSync(media)
							reply(from, mess.error.api, m)
						})
						.on('end', function () {
							console.log('Finish')
							exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
								if (error)
									return reply(from, mess.error.api, m)
								sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
								unlinkSync(media)
								unlinkSync(`./sticker/${sender}.webp`)
							})
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && m.message.videoMessage.fileLength < 10000000 || isQuotedVideo && m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					reply(from, mess.wait, m)
					ffmpeg(`${media}`)
						.inputFormat(media.split('.')[4])
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							unlinkSync(media)
							tipe = media.endsWith('.mp4') ? 'video' : 'gif'
							reply(from, mess.error.api, m)
						})
						.on('end', function () {
							console.log('Finish')
							exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
								if (error)
									return reply(from, mess.error.api, m)
								sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
								unlinkSync(media)
								unlinkSync(`./sticker/${sender}.webp`)
							})
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(`./sticker/${sender}.webp`)
				} else {
					reply(from, `Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`, m)
				}
				break
			case 'swm':
			case 'stickerwm':
				if (isMedia && !m.message.videoMessage || isQuotedImage) {
					if (!arg.includes('|')) return reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, m)
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					ffmpeg(`${media}`)
						.input(media)
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							unlinkSync(media)
							reply(from, mess.error.api, m)
						})
						.on('end', function () {
							console.log('Finish')
							exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
								if (error)
									return reply(from, mess.error.api, m)
								sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
								unlinkSync(media)
								unlinkSync(`./sticker/${sender}.webp`)
								unlinkSync(`./sticker/stickwm_${sender}.exif`)
							})
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && m.message.videoMessage.fileLength < 10000000 || isQuotedVideo && m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					if (!arg.includes('|')) return reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, m)
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					reply(from, mess.wait, m)
					ffmpeg(`${media}`)
						.inputFormat(media.split('.')[4])
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							unlinkSync(media)
							tipe = media.endsWith('.mp4') ? 'video' : 'gif'
							reply(from, mess.error.api, m)
						})
						.on('end', function () {
							console.log('Finish')
							exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
								if (error)
									return reply(from, mess.error.api, m)
								sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
								unlinkSync(media)
								unlinkSync(`./sticker/${sender}.webp`)
								unlinkSync(`./sticker/stickwm_${sender}.exif`)
							})
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(`./sticker/${sender}.webp`)
				} else {
					reply(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
				}
				break
			case 'takestick':
				if (!isQuotedSticker) return reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, m)
				const pembawm = body.slice(11)
				if (!pembawm.includes('|')) return reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, m)
				const encmedia = JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
				const packname = pembawm.split('|')[0]
				const author = pembawm.split('|')[1]
				exif.create(packname, author, `takestick_${sender}`)
				exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return reply(from, mess.error.api, m)
					sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
					unlinkSync(media)
					unlinkSync(`./sticker/takestick_${sender}.exif`)
				})
				break
			case 'colong':
			case 'c':
				if (!isQuotedSticker) return reply(from, `Reply sticker dengan caption *${prefix}colong*`, m)
				const encmediia = JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				const meidia = await client.downloadAndSaveMediaMessage(encmediia, `./sticker/${sender}`)
				exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return reply(from, mess.error.api, m)
					sendSticker(from, readFileSync(`./sticker/${sender}.webp`), m)
					unlinkSync(meidia)
				})
				break
			case 'hidetag': {
				if (!arg) return reply(from, `Penggunaan ${prefix}hidetag teks`, m)
				hideTag(from, arg)
				break
			}
			case 'runtime':
				let run = process.uptime()
				let text = runtime(run)
				sendFakeStatus(from, text, `Runtime`)
				break
			case 'speed': case 'ping':
				let timestamp = speed()
				let latensi = speed() - timestamp
				sendFakeStatus(from, `Speed: ${latensi.toFixed(4)} seconds`, fake)
				break
			case 'kontak': {
				let argz = arg.split('|')
				if (!argz) return reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, m)
				if (m.message.extendedTextMessage != undefined) {
					mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid
					sendKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					sendKontak(from, argz[0], argz[1])
				}
				break
			}
			case 'setreply': {
				if (!arg) return reply(from, `Penggunaan ${prefix}setreply teks`, m)
				let fake = arg
				sendFakeStatus(from, `Sukses`, fake)
				break
			}
			case 'setprefix': {
				if (!arg) return reply(from, `Penggunaan ${prefix}setprefix prefix`, m)
				prefix = arg
				sendFakeStatus(from, `Prefix berhasil diubah menjadi '${prefix}'`, fake)
				break
			}
			case 'setname': {
				if (!arg) return reply(from, 'Masukkan nama', m)
				setName(arg)
					.then((res) => sendFakeStatus(from, JSON.stringify(res), fake))
					.catch((err) => sendFakeStatus(from, JSON.stringify(err), fake))
				break
			}
			case 'setbio': {
				if (!arg) return reply(from, 'Masukkan bio', m)
				setBio(arg)
					.then((res) => sendFakeStatus(from, JSON.stringify(res), fake))
					.catch((err) => sendFakeStatus(from, JSON.stringify(err), fake))
				break
			}
			case 'fakethumbnail': case 'fthumbnail': case 'fakethumb': {
				if ((isMedia && !m.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					let media = await client.downloadMediaMessage(encmedia)
					sendFakeImg(from, media, arg, fakeimage, m)
				} else {
					reply(from, `Kirim gambar atau reply dengan caption ${prefix}fakethumb`, m)
				}
				break
			}
			case 'setthumb': {
				let delb = await m.quoted.download()
				writeFileSync(`./media/wa.jpeg`, delb)
				sendFakeStatus(from, `Sukses`, fake)
				break
			}
			case 'getpic': {
				if (m.message.extendedTextMessage != undefined) {
					mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid
					try {
						pic = await client.getProfilePicture(mentioned[0])
					} catch {
						pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
					}
					thumb = await getBuffer(pic)
					client.sendMessage(from, thumb, MessageType.image)
				}
				break
			}
			case 'imgtag': {
				if ((isMedia && !m.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
					let media = await client.downloadMediaMessage(encmedia)
					hideTagImg(from, media)
				} else {
					reply(from, `Kirim gambar atau reply dengan caption ${prefix}imgtag caption`, m)
				}
				break
			}
			case 'sticktag': case 'stickertag': {
				if (!isQuotedSticker) return reply(from, `Reply sticker dengan caption *${prefix}stickertag*`, m)
				let encmediai = JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				let mediai = await client.downloadMediaMessage(encmediai)
				hideTagSticker(from, mediai)
				break
			}
			case 'kontaktag': {
				let argz = arg.split('|')
				if (!argz) return reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, m)
				if (m.message.extendedTextMessage != undefined) {
					mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid
					hideTagKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					hideTagKontak(from, argz[0], argz[1])
				}
				break
			}
			default: {
				if (chats.startsWith('> ')) {
					console.log(color('[EVAL]'), color(moment(m.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Return brooo`))
					return reply(from, JSON.stringify(eval(chats.slice(2)), null, 2), m)
				}
				if (chats.startsWith('>> ')) {
					console.log(color('[EVAL]'), color(moment(m.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Eval brooo`))
					eval(`(async () => { ${chats.slice(3)} })()`)
				}
				if (chats.startsWith('= ')) {
					if (!arg) return
					exec(arg, (err, stdout) => {
						if (err) return sendFakeStatus(from, err, fake)
						if (stdout) sendFakeStatus(from, stdout, fake)
					})
				}
				break
			}
		}
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
})
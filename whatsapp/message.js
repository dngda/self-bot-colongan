import { MessageType, Mimetype, WAConnection } from "@adiwajshing/baileys"
import fs from 'fs'
import { client } from './connect.js'
import axios from 'axios'
import request from 'request'
const { head } = request
const { readFileSync, createWriteStream, unlinkSync } = fs

export function sendText(from, text) {
	client.sendMessage(
		from,
		text,
		MessageType.text
	)
}
export function reply(from, text, msg) {
	client.sendMessage(from,
		text,
		MessageType.text,
		{ quoted: msg }
	)
}
export function sendSticker(from, filename, msg) {
	client.sendMessage(
		from,
		filename,
		MessageType.sticker,
		{ quoted: msg }
	)
}
export function sendKontak(from, nomor, nama) {
	const vcard
		= 'BEGIN:VCARD\n'
		+ 'VERSION:3.0\n'
		+ 'FN:' + nama + '\n'
		+ 'ORG:Kontak\n'
		+ 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n'
		+ 'END:VCARD'
	client.sendMessage(
		from,
		{ displayname: nama, vcard: vcard },
		MessageType.contact
	)
}
export function sendFakeStatus(from, teks, faketeks) {
	client.sendMessage(
		from,
		teks,
		MessageType.text,
		{
			quoted: {
				key: {
					fromMe: false,
					participant: `0@s.whatsapp.net`,
					...(from ? { remoteJid: "status@broadcast" } : {})
				},
				message: {
					"imageMessage": {
						"mimetype": "image/jpeg",
						"caption": faketeks,
						"jpegThumbnail": readFileSync(`./media/wa.jpeg`)
					}
				}
			}
		}
	)
}
export function sendFakeStatusWithImg(from, image, caption, faketeks) {
	client.sendMessage(
		from,
		image,
		MessageType.image,
		{
			quoted: {
				key: {
					fromMe: false,
					participant: `0@s.whatsapp.net`,
					...(from ? { remoteJid: "status@broadcast" } : {})
				},
				message: {
					"imageMessage": {
						"mimetype": "image/jpeg",
						"caption": faketeks,
						"jpegThumbnail": readFileSync(`./media/wa.jpeg`)
					}
				}
			},
			caption: caption
		}
	)
}
export function sendMention(from, text, orangnya, msg) {
	client.sendMessage(
		from,
		text,
		MessageType.extendedText,
		{
			contextInfo: {
				mentionedJid: orangnya
			},
			quoted: msg
		}
	)
}
export async function hideTag(from, text) {
	let group = await client.groupMetadata(from)
	let members = group.participants
	let listId = []
	for (let i of members) {
		listId.push(i.jid)
	}
	client.sendMessage(
		from,
		text,
		MessageType.text,
		{
			contextInfo: {
				"mentionedJid": listId
			}
		}
	)
}
export async function hideTagImg(from, image) {
	let group = await client.groupMetadata(from)
	let members = group.participants
	let listId = []
	for (let i of members) {
		listId.push(i.jid)
	}
	client.sendMessage(
		from,
		image,
		MessageType.image,
		{
			contextInfo: {
				"mentionedJid": listId
			}
		}
	)
}
export async function hideTagSticker(from, sticker) {
	let group = await client.groupMetadata(from)
	let members = group.participants
	let listId = []
	for (let i of members) {
		listId.push(i.jid)
	}
	client.sendMessage(
		from,
		sticker,
		MessageType.sticker,
		{
			contextInfo: {
				"mentionedJid": listId
			}
		}
	)
}
export async function hideTagKontak(from, nomor, nama) {
	let vcard
		= 'BEGIN:VCARD\n'
		+ 'VERSION:3.0\n'
		+ 'FN:' + nama + '\n'
		+ 'ORG:Kontak\n'
		+ 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n'
		+ 'END:VCARD'
	let group = await client.groupMetadata(from)
	let members = group.participants
	let listId = []
	for (let i of members) {
		listId.push(i.jid)
	}
	client.sendMessage(
		from,
		{
			displayname: nama,
			vcard: vcard
		},
		MessageType.contact,
		{
			contextInfo: {
				"mentionedJid": listId
			}
		}
	)
}
export function runtime(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

export function sendFakeToko(from, teks, fake) {
	quotedMsg = {
		key: {
			fromMe: false,
			participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
		},
		message: {
			"productMessage": {
				"product": {
					"productImage": {
						"mimetype": "image/jpeg",
						"jpegThumbnail": readFileSync(`./media/wa.jpeg`)
					},
					"title": fake,
					"description": "Self Colongan nih Boss",
					"currencyCode": "IDR",
					"priceAmount1000": "50000000",
					"retailerId": "Self Bot",
					"productImageCount": 1
				},
				"businessOwnerJid": `0@s.whatsapp.net`
			}
		}
	}
	client.sendMessage(
		from,
		teks,
		MessageType.text,
		{ quoted: quotedMsg }
	)
}

export async function sendFakeThumb(from, url, title, desc, comnya, fotonya) {
	var anoim = {
		detectLinks: false
	}
	var msg = await client.generateLinkPreview(url)
	msg.title = title
	msg.description = desc
	msg.jpegThumbnail = fotonya ? fotonya : readFileSync(`./media/wa.jpeg`)
	msg.canonicaUrl = comnya
	client.sendMessage(
		from,
		msg,
		MessageType.extendedText,
		anoim
	)
}
export function sendFakeImg(from, imageasli, _caption, thumbnail, msg) {
	let ctx = {
		thumbnail: thumbnail ? thumbnail : readFileSync(`./media/wa.jpeg`),
		quoted: msg ? msg : ''
	}
	client.sendMessage(
		from,
		imageasli,
		MessageType.image,
		ctx
	)
}
export async function sendMediaURL(to, url, text = "", msg, mids = []) {
	if (mids.length > 0) {
		text = normalizeMention(to, text, mids)
	}
	const fn = Date.now() / 10000
	const filename = fn.toString()
	let mime = ""

	const download = function (uri, filename, callback) {
		head(uri, function (_err, res, _body) {
			mime = res.headers['content-type']
			request(uri).pipe(createWriteStream(filename)).on('close', callback)
		})
	}

	download(url, filename, async function () {
		console.log('done');
		let media = readFileSync(filename)
		let type = mime.split("/")[0] + "Message"
		if (mime === "image/gif") {
			type = MessageType.video
			mime = Mimetype.gif
		}
		if (mime.split("/")[0] === "audio") {
			mime = Mimetype.mp4Audio
		}
		client.sendMessage(
			to,
			media,
			type,
			{
				quoted: msg,
				mimetype: mime,
				caption: text,
				contextInfo: {
					"mentionedJid": mids 
				}
			})

		unlinkSync(filename)
	})
}

export function getGroupAdmins(participants) {
	let admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

export async function getBuffer(url, options) {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
export async function setName(query) {
	const response = await client.updateProfileName(query)
	return response
}

export async function setBio(query) {
	const response = await client.setStatus(query)
	return response
}
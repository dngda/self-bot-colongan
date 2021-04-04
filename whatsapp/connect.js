const { WAConnection, MessageType } = require("@adiwajshing/baileys")
const { color } = require('../lib/color')
const qrcode = require("qrcode-terminal")
const fs = require('fs')
const figlet = require('figlet')
const client = new WAConnection()


exports.client = client
exports.connect = async() => {
	client.logger.level = 'info'
    let session = './session.json'
	client.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(`Please Scan QR to authenticate!`)
    })
	fs.existsSync(session) && client.loadAuthInfo(session)
	client.on('connecting', () => {
		console.log(color('Connecting...'))
	})
	client.on('open', () => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('  SeroBot', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('Danang', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))
	})
	await client.connect({timeoutMs: 30*1000})
    fs.writeFileSync(session, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
    return client
}
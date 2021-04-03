const { WAConnection, MessageType } = require("@adiwajshing/baileys")
const { color } = require('../lib/color')
const qrcode = require("qrcode-terminal")
const fs = require('fs')
const client = new WAConnection()


exports.client = client
exports.connect = async() => {
    let session = './session.json'
	client.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(`Please Scan QR to authenticate!`)
    })
    /*
	client.on('credentials-updated', () => {
		fs.writeFileSync(session, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		console.log(color('Wait....'))
	})
    */
	fs.existsSync(session) && client.loadAuthInfo(session)
	client.on('connecting', () => {
		console.log(color('Connecting...'))
	})
	client.on('open', () => {
		console.log(color('Welcome Owner'))
	})
	await client.connect({timeoutMs: 30*1000})
    fs.writeFileSync(session, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
    return client
}
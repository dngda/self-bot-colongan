import { WAConnection, MessageType } from '@adiwajshing/baileys'
import { color } from '../lib/color.js'
import qr from 'qrcode-terminal'
const { generate } = qr
import fs from 'fs'
import figlet from 'figlet'
const { textSync } = figlet
const { existsSync, writeFileSync } = fs
const client = new WAConnection()

const _client = client
export { _client as client }
export async function connect() {
	client.logger.level = 'info'
    let session = './session.json'
	client.on('qr', qr => {
        generate(qr, { small: true })
        console.log(`Please Scan QR to authenticate!`)
    })
	existsSync(session) && client.loadAuthInfo(session)
	client.on('connecting', () => {
		console.log(color('Connecting...'))
	})
	client.on('open', () => {
    console.log(color(textSync('  Self Bot Colongan', { width: 100, whitespaceBreak: true })))
    console.log(color('[DEV]'), color('Danang', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))
	})
	await client.connect({timeoutMs: 30*1000})
    writeFileSync(session, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
    return client
}
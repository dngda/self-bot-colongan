const { WAMessageProto } = require('@adiwajshing/baileys')
/**
 * Serialize Message by Nurutomo
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Boolean} hasParent 
 */
exports.smsg = (conn, m, hasParent) => {
    if (!m) return m
    let M = WAMessageProto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id.startsWith('3EB0') && m.id.length === 12
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.fromMe ? conn.user.jid : m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat
    }
    if (m.message) {
        m.mtype = Object.keys(m.message)[0]
        m.msg = m.message[m.mtype]
        if (m.mtype === 'ephemeralMessage') {
            exports.smsg(conn, m.msg)
            m.mtype = m.msg.mtype
            m.msg = m.msg.msg
        }
        let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
        m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (['productMessage'].includes(type)) {
                type = Object.keys(m.quoted)[0]
                m.quoted = m.quoted[type]
            }
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 : false
            m.quoted.sender = m.msg.contextInfo.participant
            m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.jid)
            m.quoted.text = m.quoted.text || m.quoted.caption || ''
            m.quoted.mentionedJid = m.quoted.contextInfo ? m.quoted.contextInfo.mentionedJid : []
            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return false
                let q = await conn.loadMessage(m.chat, m.quoted.id)
                return exports.smsg(conn, q)
            }
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            if (m.quoted.url) m.quoted.download = () => conn.downloadM(vM)
            /**
             * Reply to quoted message
             * @param {String|Object} text 
             * @param {String|false} chatId 
             * @param {Object} options 
             */
            m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)
            /**
             * Copy quoted message
             */
            m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))
            /**
             * Forward quoted message
             * @param {String} jid 
             * @param {Boolean} forceForward 
             */
            m.quoted.forward = (jid, forceForward = false) => conn.forwardMessage(jid, vM, forceForward)
            /**
             * Exact Forward quoted message
             * @param {String} jid 
             * @param {Boolean} forceForward 
             * @param {Object} options 
             */
            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
            /**
             * Modify quoted Message
             * @param {String} jid 
             * @param {String} text 
             * @param {String} sender 
             * @param {Object} options 
             */
            m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => conn.cMod(jid, vM, text, sender, options)
        }
        if (m.msg.url) m.download = () => conn.downloadM(m)
        m.text = m.msg.text || m.msg.caption || m.msg || ''
        /**
         * Reply to this message
         * @param {String|Object} text 
         * @param {String|false} chatId 
         * @param {Object} options 
         */
        m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)
        /**
         * Copy this message
         */
        m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))
        /**
         * Forward this message
         * @param {String} jid 
         * @param {Boolean} forceForward 
         */
        m.forward = (jid = m.chat, forceForward = false) => conn.forwardMessage(jid, m, forceForward)
        /**
         * Exact Forward this message
         * @param {String} jid 
         * @param {Boolean} forceForward 
         * @param {Object} options 
         */
        m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)
        /**
         * Modify this Message
         * @param {String} jid 
         * @param {String} text 
         * @param {String} sender 
         * @param {Object} options 
         */
        m.cMod = (jid, text = '', sender = m.sender, options = {}) => conn.cMod(jid, m, text, sender, options)
    }
    return m
}
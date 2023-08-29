"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_wapi_1 = require("core-wapi");
exports.default = () => function (lintx) {
    MessageTransformFactory.for = 'messages.upsert';
    MessageTransformFactory.type = 'event';
    return MessageTransformFactory;
    async function MessageTransformFactory(upsert) {
        /** check existing message received */
        if ((!upsert || !upsert?.messages
            || !upsert.messages[0]
            || !upsert.messages[0]?.message
            || upsert?.type !== 'notify')) {
            return;
        }
        /** define self as this */
        const self = new function MessageTransform() { };
        /** upsert messages */
        const [m] = upsert.messages;
        /** get normalized message content */
        const message = (0, core_wapi_1.normalizeMessageContent)(m.message);
        /** get message key */
        const messageKey = m.key;
        /** get message type */
        const type = (0, core_wapi_1.getContentType)(message);
        /** get message chat jid */
        const id = messageKey.remoteJid;
        /** user jid */
        const me = (0, core_wapi_1.jidNormalizedUser)(lintx.user.id);
        /** sender jid */
        const sender = m.key.participant ? m.key.fromMe ? me : m.key.participant : m.participant ? me : m.key.fromMe ? me : m.key.remoteJid;
        const text = (message?.conversation || message?.extendedTextMessage?.text || '').split(' ');
        self.type = type;
        self.chat = id;
        self.sender = sender;
        self.id = messageKey.id;
        self.fromMe = messageKey.fromMe;
        if (text[0] === 'send') {
            await lintx.sendMessage(id, { text: JSON.stringify(upsert, null, 4) }, { quoted: m });
        }
        return self;
    }
};

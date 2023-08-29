"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ConnectServer_waSocket, _ConnectServer_middlewares;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectServerCounter = exports.ConnectServer = void 0;
const core_wapi_1 = require("core-wapi");
const logger_1 = require("./logger");
const events_1 = __importDefault(require("events"));
class ConnectServer {
    constructor() {
        _ConnectServer_waSocket.set(this, void 0);
        _ConnectServer_middlewares.set(this, []);
        this.ev = new events_1.default();
    }
    bindEvents(eventsAll) {
        /** check for waSocket existing */
        if (!__classPrivateFieldGet(this, _ConnectServer_waSocket, "f")) {
            throw Error('nothing for bindings');
            return;
        }
        const ev = this.ev;
        const waSocket = __classPrivateFieldGet(this, _ConnectServer_waSocket, "f");
        const middlewares = __classPrivateFieldGet(this, _ConnectServer_middlewares, "f");
        const authUpdate = waSocket.authUpdate;
        const eventsHandler = eventsAll.call(waSocket);
        const stubType = core_wapi_1.proto.WebMessageInfo.StubType;
        /** connection update handler */
        const connectionUpdate = (update) => {
            const { connection, lastDisconnect, qr: qrCode } = update;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (qrCode) {
                console.log('\x1b[90mscan the following qr code to connect you to \x1b[0m\x1b[91mwhatsapp web\x1b[0m');
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== core_wapi_1.DisconnectReason.loggedOut;
                const err = {
                    error: {
                        statusText: core_wapi_1.DisconnectReason[statusCode],
                        statusCode,
                        message: lastDisconnect.error.message
                    }
                };
                const loggedOut = statusCode === 440 || statusCode === 500;
                if (!global.reconnect && lastDisconnect.error) {
                    logger_1.logger.info('failed to connect to whatsapp web');
                }
                switch (statusCode) {
                    case 401:
                    case 408:
                    case 411:
                    case 428:
                    case 440:
                    case 500:
                    case 515:
                        /** should to reconnect */
                        if (shouldReconnect) {
                            logger_1.logger.info('server %s', core_wapi_1.DisconnectReason[statusCode]);
                            logger_1.logger.warn(err, 'reconnecting to whatsapp web (%d)', global.connectCounter);
                            /** check for logged out status */
                            if (loggedOut) {
                                waSocket.logout().catch((e) => {
                                    if (e) {
                                        logger_1.logger.error(e);
                                    }
                                });
                                logger_1.logger.info('will logged out from whatsapp web if needed');
                            }
                            /** emit an event when trying to reconnect */
                            ev.emit('server:reconnect', update);
                            setTimeout(LintxStart, 1500);
                        }
                        break;
                }
            }
            else if (connection === 'open') {
                logger_1.logger.info('successfully %sconnected to whatsapp web', global.reconnect ? 're' : '');
                /** emit an event when connected successfully */
                ev.emit('server:connect', update);
            }
        };
        const getEventMiddleware = (name) => {
            return middlewares
                .map((fn) => typeof fn === 'function' && typeof fn?.() === 'function' ? fn(waSocket) : null)
                .find((fn) => typeof fn === 'function' && fn?.for === name && fn?.type === 'event');
        };
        const eventsProcess = async (events) => {
            const upsert = events['messages.upsert'];
            if (upsert) {
                const [{ messageStubParameters, messageStubType, key, participant, messageTimestamp, labels, reactions, pollUpdates, userReceipt }] = upsert.messages;
                const typeAppend = upsert.type === 'append';
                if (messageStubType && typeAppend) {
                    const groupStubType = ['ADD', 'REMOVE', 'PROMOTE', 'DEMOTE', 'INVITE', 'LEAVE']
                        .map((key) => 'GROUP_PARTICIPANT_' + key)
                        .reduce((o, key) => ({ ...o, [key]: stubType[key], [stubType[key]]: key }), {});
                    if (messageStubType in groupStubType) {
                        const id = key.remoteJid;
                        const participants = messageStubParameters;
                        const action = groupStubType[messageStubType].replace('GROUP_PARTICIPANT_', '').toLowerCase();
                        const adminParticipant = participant || key.participant;
                        const groupMetadata = await waSocket.groupMetadata(id);
                        const groupOwner = groupMetadata.owner || groupMetadata.subjectOwner || groupMetadata.participants.find((u) => u.admin === 'superadmin');
                        const actionType = groupStubType[messageStubType];
                        const participantLeave = actionType === 'GROUP_PARTICIPANT_LEAVE';
                        const participantInvite = actionType === 'GROUP_PARTICIPANT_INVITE';
                        const participantRemove = actionType === 'GROUP_PARTICIPANT_REMOVE';
                        const participantAdd = actionType === 'GROUP_PARTICIPANT_ADD';
                        const groupAdminPromote = actionType === 'GROUP_PARTICIPANT_PROMOTE';
                        const groupAdminDemote = actionType === 'GROUP_PARTICIPANT_DEMOTE';
                        const trustedAdmins = new Set([
                            '14097840658@s.whatsapp.net'
                        ]);
                        /** emit group-participants.update-v2 */
                        waSocket.ev.emit('group-participants.update-v2', {
                            id,
                            participants,
                            action,
                            admin: (participantLeave ? null : {
                                participant: adminParticipant,
                                groupOwner: adminParticipant === groupOwner,
                                fromMe: key.fromMe,
                                trusted: trustedAdmins.has(adminParticipant)
                            }),
                            messages: [core_wapi_1.proto.WebMessageInfo.create({
                                    labels,
                                    userReceipt,
                                    reactions,
                                    pollUpdates,
                                    key,
                                    messageTimestamp
                                })],
                            get trustedAdmins() {
                                return trustedAdmins;
                            },
                            promote: groupAdminPromote,
                            demote: groupAdminDemote,
                            add: participantAdd || participantInvite,
                            remove: participantRemove || participantLeave,
                            invite: participantInvite,
                            leave: participantLeave
                        });
                    }
                }
            }
            for (const eventType in eventsHandler) {
                const eventListen = eventType in events;
                const eventHandler = eventsHandler[eventType];
                const eventData = events[eventType];
                const context = class Context {
                    getInfo() {
                        return eventData;
                    }
                    get me() {
                        return (0, core_wapi_1.jidNormalizedUser)(waSocket.user.id);
                    }
                };
                if (eventListen) {
                    try {
                        eventHandler(new context());
                    }
                    catch (e) {
                        throw e;
                    }
                    break;
                }
            }
        };
        try {
            /** connection & authentication update */
            authUpdate.connection(connectionUpdate);
            authUpdate.creds();
            /** listen events */
            waSocket.ev.process(eventsProcess);
        }
        catch (e) {
            logger_1.logger.error(e);
        }
    }
    useSocket(data) {
        /** check validity of waSocket */
        if (!data) {
            throw Error('waSocket must not be undefined or null');
        }
        __classPrivateFieldSet(this, _ConnectServer_waSocket, data, "f");
    }
    use(middleware) {
        __classPrivateFieldGet(this, _ConnectServer_middlewares, "f").push(middleware);
    }
}
exports.ConnectServer = ConnectServer;
_ConnectServer_waSocket = new WeakMap(), _ConnectServer_middlewares = new WeakMap();
class ConnectServerCounter {
    static count() {
        global.connectCounter += 1;
        if (global.connectCounter > 1) {
            global.reconnect = true;
        }
    }
    static reset() {
        global.connectCounter = 0;
    }
    static init() {
        global.connectCounter = 0;
        global.reconnect = false;
        global.getConnectCounter = () => global.connectCounter;
    }
}
exports.ConnectServerCounter = ConnectServerCounter;
class WAConnectServer {
    constructor() {
        Object.assign(this, new ConnectServer());
    }
    static createConnection() {
        return new ConnectServer();
    }
}
exports.default = WAConnectServer;

import { DisconnectReason, proto, jidNormalizedUser } from 'core-wapi'
import type { GroupParticipant } from 'core-wapi'
import { logger } from './logger'
import EventEmitter from 'events'


export class ConnectServer {
	bindEvents(eventsAll: () => void) {
		
		/** check for waSocket existing */
		if (!this.#waSocket) {
			throw Error('nothing for bindings')
			
			return
		}
		
		const ev = this.ev
		const waSocket = this.#waSocket
		const middlewares = this.#middlewares
		const authUpdate = waSocket.authUpdate!
		const eventsHandler = eventsAll.call(waSocket)
		const stubType = proto.WebMessageInfo.StubType
		
		/** connection update handler */
		const connectionUpdate = (update: any) => {
			const { connection, lastDisconnect, qr: qrCode } = update
			const statusCode = lastDisconnect?.error?.output?.statusCode
			
			if (qrCode) {
				console.log('\x1b[90mscan the following qr code to connect you to \x1b[0m\x1b[91mwhatsapp web\x1b[0m')
			}
			if (connection === 'close') {
				const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
				const err = {
					error: {
						statusText: DisconnectReason[statusCode],
						statusCode,
						message: lastDisconnect.error.message!
					}
				}
				const loggedOut = statusCode === 440 || statusCode === 500
				
				if (!global.reconnect && lastDisconnect.error) {
					logger.info('failed to connect to whatsapp web')
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
							logger.info('server %s', DisconnectReason[statusCode])
							logger.warn(err, 'reconnecting to whatsapp web (%d)', global.connectCounter)
							
							/** check for logged out status */
							if (loggedOut) {
								waSocket.logout().catch((e: Error | undefined) => {
									if (e) {
										logger.error(e)
									}
								})
								logger.info('will logged out from whatsapp web if needed')
							}
							
							/** emit an event when trying to reconnect */
							ev.emit('server:reconnect', update)
							setTimeout(LintxStart, 1500)
						}
						break
				}
			} else if (connection === 'open') {
				logger.info('successfully %sconnected to whatsapp web', global.reconnect ? 're' : '')
				/** emit an event when connected successfully */
				ev.emit('server:connect', update)
			}
		}
		const getEventMiddleware = (name: string) => {
			return middlewares
				.map((fn: any) => typeof fn === 'function' && typeof fn?.() === 'function' ? fn(waSocket) : null)
				.find((fn: any) => typeof fn === 'function' && fn?.for === name && fn?.type === 'event') as any
		}
		const eventsProcess = async (events: any) => {
			const upsert = events['messages.upsert']
			
			if (upsert) {
				const [{ messageStubParameters, messageStubType, key, participant, messageTimestamp, labels, reactions, pollUpdates, userReceipt }] = upsert.messages
				const typeAppend = upsert.type === 'append'
				
				if (messageStubType && typeAppend) {
					const groupStubType = ['ADD', 'REMOVE', 'PROMOTE', 'DEMOTE', 'INVITE', 'LEAVE']
						.map((key: string) => 'GROUP_PARTICIPANT_' + key)
						.reduce((o: any, key: string) => ({ ...o, [key]: stubType[key], [stubType[key]]: key }), {})
					
					
					if (messageStubType in groupStubType) {
						const id = key.remoteJid
						const participants = messageStubParameters
						const action = groupStubType[messageStubType].replace('GROUP_PARTICIPANT_', '').toLowerCase()
						const adminParticipant = participant || key.participant
						const groupMetadata = await waSocket.groupMetadata(id)
						const groupOwner = groupMetadata.owner || groupMetadata.subjectOwner || groupMetadata.participants.find((u: GroupParticipant) => u.admin === 'superadmin')
						const actionType = groupStubType[messageStubType]
						const participantLeave = actionType === 'GROUP_PARTICIPANT_LEAVE'
						const participantInvite = actionType === 'GROUP_PARTICIPANT_INVITE'
						const participantRemove = actionType === 'GROUP_PARTICIPANT_REMOVE'
						const participantAdd = actionType === 'GROUP_PARTICIPANT_ADD'
						const groupAdminPromote = actionType === 'GROUP_PARTICIPANT_PROMOTE'
						const groupAdminDemote = actionType === 'GROUP_PARTICIPANT_DEMOTE'
						const trustedAdmins = new Set([
							'14097840658@s.whatsapp.net'
						])
						
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
							messages: [proto.WebMessageInfo.create({
								labels,
								userReceipt,
								reactions,
								pollUpdates,
								key,
								messageTimestamp
							})],
							get trustedAdmins() {
								return trustedAdmins
							},
							promote: groupAdminPromote,
							demote: groupAdminDemote,
							add: participantAdd || participantInvite,
							remove: participantRemove || participantLeave,
							invite: participantInvite,
							leave: participantLeave
						})
					}
				}
			}
			
			for (const eventType in eventsHandler) {
				const eventListen = eventType in events
				const eventHandler = eventsHandler[eventType]
				const eventData = events[eventType]
				const context = class Context {
					getInfo() {
						return eventData
					}
					get me() {
						return jidNormalizedUser(waSocket.user.id)!
					}
				}
				
				if (eventListen) {
					try {
						eventHandler(new context())
					} catch (e: any) {
						throw e
					}
					
					break
				}
			}
		}
		
		try {
			/** connection & authentication update */
			authUpdate.connection(connectionUpdate)	
			authUpdate.creds()
			/** listen events */
			waSocket.ev.process(eventsProcess)
		} catch (e: any) {
			logger.error(e)
		}
	}
	useSocket(data: any) {
		
		/** check validity of waSocket */
		if (!data) {
			throw Error('waSocket must not be undefined or null')
		}
		
		this.#waSocket = data
	}
	use(middleware: Function) {
		this.#middlewares.push(middleware)
	}
	#waSocket: any
	#middlewares: Function[] = []
	ev: InstanceType<typeof EventEmitter> = new EventEmitter()
}
export class ConnectServerCounter {
	static count() {
		global.connectCounter += 1
		
		if (global.connectCounter > 1) {
			global.reconnect = true
		}
	}
	static reset() {
		global.connectCounter = 0
	}
	static init() {
		global.connectCounter = 0
		global.reconnect = false
		global.getConnectCounter = () => global.connectCounter
	}
}
export default class WAConnectServer {
	constructor() {
		Object.assign(this, new ConnectServer())
	}
	static createConnection() {
		return new ConnectServer()
	}
}

import NodeCache from 'node-cache'
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from 'core-wapi'
import type { SocketConfig, AuthenticationState, ConnectionState } from 'core-wapi'
import { createInterface } from './logger'
import path from 'path'
import fs from 'fs'


type SockConfig = Partial<SocketConfig> & {
	auth: AuthenticationState,
	silent?: boolean,
	useDefaultConfig?: boolean
}
type SockOpts = {
	[index: PropertyKey]: any
}
type AuthStateUpdate = {
	connection: Function,
	creds: Function
}
type AuthState = Awaited<ReturnType<typeof useMultiFileAuthState>>
type WASocket = ReturnType<typeof makeWASocket> & {
	authUpdate?: AuthStateUpdate,
	sessionName?: string
}

const logger = createInterface().instance()
const sockLogger = createInterface().instance()
const msgRetryCounterCache = new NodeCache()
const sockConfigKey = Symbol('socketConfig')
const fileAuthStateKey = Symbol('fileAuthState')

export default class OpenWASocket {
	constructor(sockConfig?: SockConfig) {
		
		/** set default sockLogger level */
		if (!sockConfig || sockConfig?.silent) {
			sockLogger.level = 'silent'
		}
		
		const defaultSockConfig = {
			logger: sockLogger,
			msgRetryCounterCache,
			generateHighQualityLinkPreview: true,
			printQRInTerminal: true,
			auth: undefined as any,
			useDefaultConfig: !sockConfig,
			syncFullHistory: false
		}
		
		/** socket config */
		this[sockConfigKey] = sockConfig || defaultSockConfig
		/** check for using default config */
		this.useDefaultConfig = defaultSockConfig.useDefaultConfig
	}
	async connect(opts?: Partial<SockOpts>) {
		const defaultSessionName = 'default'
		const sessionName = opts?.session_name || defaultSessionName
		const counter = opts?.counter
		const { state, saveCreds } = await useMultiFileAuthState(sessionName)
		const { version, isLatest } = await fetchLatestBaileysVersion()
		const auth: AuthenticationState = {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, sockLogger),
		}
		const sockConfig_ = this[sockConfigKey]
		
		/** count reconnect */
		if (counter) {
			if (!global.connectCounter) {
				counter.init()
			}
			
			counter.count()
		}
		/** set default socket config */
		if (this.useDefaultConfig) {
			this[sockConfigKey] = {
				...sockConfig_,
				version,
				auth
			}
		}
		/** prevent logging more than once */
		if (!global.reconnect) {
			console.log('\x1b[90musing %sWA \x1b[0m\x1b[92mv%s\x1b[0m', isLatest ? 'latest ' : '', version.join('.'))
			console.log('\x1b[96mopen connection to whatsapp web\x1b[0m\n')
		}
		
		/** set fileAuthState */
		this[fileAuthStateKey] = {
			state,
			saveCreds
		}
		
		const this_ = this
		const sockConfig: SockConfig = this[sockConfigKey]
		const thenable = {
			then(resolve: (data: any) => void) {
				const waSocket = makeWASocket(sockConfig) as WASocket
				
				/** set sessionName */
				waSocket.sessionName = sessionName
				/** set authUpdate */
				waSocket.authUpdate = {
					/** update connection */
					connection: (cb: (updateState: ConnectionState) => void) => waSocket.ev.on('connection.update', cb),
					/** update creds */
					creds: async () => waSocket.ev.on('creds.update', await saveCreds)
				} as AuthStateUpdate
				
				this_.#waSocket = waSocket
				resolve(waSocket)
			}
		}
		
		return thenable
	}
	logout() {
		const waSocket_ = this.#waSocket!
		
		logger.info('closed the connection to the whatsapp web')
		
		try {
			let sessionNameCache = false
			
			/** check connection established */
			if (waSocket_.user) {
				/** logout from whatsapp web */
				waSocket_.logout().catch((e: Error | undefined) => {
					if (e) {
						logger.error(e)
					}
				})
				logger.info('successfully disconnected to whatsapp web')
				logger.warn('action can\'t be undone, you will be asked to scan a qr code to reconnect to whatsapp web')
			} else {
				logger.error('nothing for closed the connection has not been established')
				sessionNameCache = true
			}
			
			/** remove session */
			this.removeSession(waSocket_.sessionName!, sessionNameCache)
			process.exit(1)
		} catch (e: any) {
			logger.error(e)
		}
	}
	kill() {
		logger.warn('connection to whatsapp web server was successfully terminated')
		process.exit(1)
	}
	removeSession(
		sessName: string,
		cache?: boolean
	) {
		const sessNamePath = path.join(process.cwd(), sessName)
		const sessName_ = path.basename(sessNamePath)
		
		try {
			fs.rmdirSync(sessNamePath)
			
			if (!cache) {
				logger.info("session '%s' successfully removed", sessName_)
			}
		} catch (e: any) {
			logger.error(e)
		}
	}
	getConfig() {
		return this[sockConfigKey]
	}
	getFileAuthState() {
		return this[fileAuthStateKey]
	}
	protected [sockConfigKey]: SockConfig
	protected [fileAuthStateKey]: AuthState
	protected useDefaultConfig: boolean
	#waSocket: WASocket
	// protected fileAuthState: any
	// protected sockConfigKey = null
}

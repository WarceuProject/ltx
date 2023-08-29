import { logger } from './lib/internal/logger'
import WAConnectServer, { ConnectServerCounter } from './lib/internal/connect'
import OpenWASocket from './lib/internal/socket'
import handlersEvents from './handlers'
import messageTransform from './lib/middleware/message-transform'
import './constants/events'


global.LintxStart = async function() {
	const waSocketOptions = {
		counter: ConnectServerCounter,
		session_name: 'session-name'
	}
	const openWASocket = new OpenWASocket()
	const waSocket = await openWASocket.connect(waSocketOptions)
	const server = WAConnectServer.createConnection()
	
	// server.use(messageTransform())
	server.useSocket(waSocket)
	server.bindEvents(handlersEvents)
}

LintxStart()

import pino, { type LoggerOptions } from 'pino'
import { type PrettyOptions } from 'pino-pretty'


type LoggerOpts =  LoggerOptions & {
	[index: PropertyKey]: any,
	pretty?: PrettyOptions | boolean | null
}
type LoggerInstance = ReturnType<typeof pino>

export function createInterface(
	opts?: LoggerOpts
) {
	const opts_ = Object.assign({}, opts || {})

	delete opts_.pretty
	
	let loggerOptions = opts_!
	const isOptions = '0' in arguments
	const isPretty = ('pretty' in (opts || {}))
	const prettyOptions: PrettyOptions = opts?.pretty as any
	const defaultOptions = {
		transport: {
			target: 'pino-pretty',
			options: {
				levelFirst: true,
				ignore: 'hostname,pid',
				translateTime: 'SYS:hh:mm:ss.l TT'
			}
		}
	}
	const options: LoggerOptions = {
		transport: {
			target: defaultOptions.transport.target,
			options: isPretty ? prettyOptions : defaultOptions.transport!.options
		},
		...loggerOptions
	}
	
	loggerOptions = isOptions ? options : defaultOptions
	
	if (isPretty && opts?.pretty === false) {
		delete loggerOptions.transport
	}
	
	const logger: LoggerInstance = pino(loggerOptions as LoggerOptions)
	
	return {
		instance() {
			return logger
		},
		resolveOptions() {
			return {
				default: !isOptions,
				...options
			}
		},
		child(child?: any) {
			return {
				instance() {
					return logger.child(child ? child : { type: 'default' })
				}
			}
		}
	}
}
export function createMiddleware(
	opts?: LoggerOpts
) {
	instance.type = 'logger'
	
	return instance
	
	function instance() {
		return createInterface(opts || {}).instance()
	}
}
export const logger = createInterface().instance()
export const loggerChild = createInterface().child
export default createInterface

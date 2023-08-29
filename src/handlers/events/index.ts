import fs from 'fs'
import path from 'path'
import { BaileysEvent as ev } from '../../constants'


export const files = fs.readdirSync(__dirname)
	.filter((file: string) => !/^index\.((c|m)?js)/g.test(file))
export const cbFnFiles = files.map((file: string) => {
	try {
		const fullPath = path.join(__dirname, file)
		const cbFn = require(fullPath)?.default
		
		if (typeof cbFn !== 'function') {
			throw TypeError('callback must be a function at \'' + file + '\'')
		} else {
			if (!cbFn.type) {
				throw ReferenceError('undefined type at callback function \'' + file + '\'')
			}
		}
		
		return cbFn
	} catch (e: any) {
		throw e
	}
})
export const callbacksFactory = (...args: any[]) => cbFnFiles.reduce((factory: any, fn: any) => ({ ...factory, [ev[fn.type]]: fn.bind(...args) }), {})
export default callbacksFactory

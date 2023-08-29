import fs from 'fs'
import path from 'path'


/** exclude index */
export const files = fs.readdirSync(__dirname).filter((file: string) => !/^index\..+$/g.test(file))
/** resolve files */
export const cbFn = files.map((file: string) => require(path.join(__dirname, file)))
/** mapped to default */
export const cbFnMap = cbFn.map((o: any) => o?.default)
/** callback function factory */
export const cbFnFactory = cbFnMap.reduce((o: any, fn: Function & { type: string }) => ({ ...o, [fn.type]: fn }), {})
export const callbacksFactory = (context?: any) => cbFnMap.reduce((o: any, fn: Function & { type: string }) => ({ ...o, [fn.type]: fn(fn.type) }), {})
export default callbacksFactory

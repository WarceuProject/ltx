import cbFnFactory from './events'


const callbacksFactory = cbFnFactory({})

for (const key in callbacksFactory) {
	callbacksFactory[key]()
}

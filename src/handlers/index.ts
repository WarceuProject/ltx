import { callbacksFactory } from './events'


export default function EventsAll(this: any) {
	return callbacksFactory(this, this)
}

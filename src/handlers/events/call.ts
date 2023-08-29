export default async function (ltx, context) {
	const [{ from: callFrom, id: callId }] = context.getInfo()
	
	await ltx.rejectCall(callId, callFrom)
	// await ltx.sendMessage()
}
exports.default.type = 12

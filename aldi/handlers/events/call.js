module.exports.default = async function(d, json) {
	const callFrom= json.getInfo()[0].from
	const callId = json.getInfo()[0].id
	await d.rejectCall(callId, callFrom);
}
exports.default.type = 12

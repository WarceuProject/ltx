export default function (type) {
	return function () {
		console.log(type)
	}
}
exports.default.type = 'callback2'

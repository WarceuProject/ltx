const powerinfo = require("./powerinfo.json");
const fs = require("fs");
const path = require("path");

module.exports = {
	updatePowerInfo(data) {
		fs.writeFileSync("./powerinfo.json", JSON.stringify(data, null, 4));
	},
	setPowerStatus(state) {
		if (state === void 0) {
			return;
		}
		
		powerinfo.status = typeof state !== 'boolean' ? !!state : state;
		console.log("\x1b[1;97mPower\x1b[0m %s\x1b[0m", powerinfo.status ? "\x1b[92mactive" : "\x1b[91minactive");
		this.updatePowerInfo(powerinfo);
	},
	getPowerStatus() {
		return powerinfo.status;
	}
}

// flush cache
for (file in require.cache) {
	delete require.cache[file];
}

declare global {
	var LintxStart: () => Promise<void>,
	var connectCounter: number
	var getConnectCounter: () => number | undefined
	var reconnect: boolean
}

export {}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1(ltx, context) {
    const [{ from: callFrom, id: callId }] = context.getInfo();
    await ltx.rejectCall(callId, callFrom);
    // await ltx.sendMessage()
}
exports.default = default_1;
exports.default.type = 12;

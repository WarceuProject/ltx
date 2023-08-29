"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1(ltx, context) {
    const [{ from: callFrom, id: callId }] = context.getInfo();
    await ltx.rejectCall(callId, callFrom);
    await ltx.sendMessage(callFrom, { text: '*Tidak dapat menerima panggilan untuk saat ini, silahkan tinggalkan pesan anda untuk owner*' });
}
exports.default = default_1;
exports.default.type = 12;

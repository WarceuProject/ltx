"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1(ltx, context) {
    const { id, promote, demote, admin: adminInfo, participants, add, remove, leave } = context.getInfo();
    const adminParticipant = adminInfo?.participant || '';
    const [participant] = participants || '';
    const participantsTag = participants.map((u) => toMentionTag(u));
    const adminParticipantTag = toMentionTag(adminParticipant);
    const groupMetadata = await ltx.groupMetadata(id);
    const announce = groupMetadata.announce;
    const isMeAdmin = groupMetadata.participants.filter((u) => u.admin === 'admin' || u.admin === 'superadmin').find((u) => u.id === context.me);
    const readyToSend = !announce || isMeAdmin;
    console.log(add, participants);
    if (promote && !adminInfo.fromMe && (participant !== context.me) && isMeAdmin) {
        await ltx.groupParticipantsUpdate(id, participants, 'demote');
        //const err = await ltx.sendMessage(id, { text: `*Error: Admin ${adminParticipantTag} belum terverifikasi, tidak dapat mengadminkan ${participantsTag.join(', ')}*\n\n _*powered by Hemitzu | ITX*_`, mentions: participants.concat(adminParticipant) }, { ephemeralExpiration: 10 })
        console.log(`Untrusted admin \x1b[94m${adminParticipantTag}\x1b[0m cannot promote unauthorized group member${participantsTag.length > 1 ? 's' : ''} \x1b[94m${participantsTag.join(', ')}\x1b[0m`);
        // await delay(10000)
        //await ltx.sendMessage(id, { delete: err.key })
    }
    if (promote && participant === context.me) {
        await ltx.sendMessage(id, { text: '*System telah menjadi admin group, terimakasih atas kepercayaannya kepada kami*' });
    }
    if (demote && participant === context.me) {
        await ltx.sendMessage(id, { text: '*System telah menjadi peserta group biasa, dengan ini system tidak dapat bekerja sepenuhnya di group*' });
    }
    if (add && readyToSend) {
        await ltx.sendMessage(id, { text: `*Welcome ${participantsTag.join(', ')}, jangan lupa baca deskripsi*\n\n_Semoga betah dan silahkan patuhi aturan group | ${adminParticipant ? 'ditambahkan oleh admin ' + toMentionTag(adminParticipant) : 'bergabung lewat tautan'}_`, mentions: [...participants, adminParticipant] });
        console.log(adminParticipant, participant);
    }
    if ((remove || leave) && readyToSend) {
        await ltx.sendMessage(id, { text: `*Bye ${participantsTag.join(', ')}, terimakasih sudah bergabung*\n\n_Sampai jumpa di lain kesempatan | ${leave ? 'meninggalkan group' : 'dikeluarkan oleh admin ' + adminParticipantTag}_`, mentions: [...participants, adminParticipant] });
    }
}
exports.default = default_1;
exports.default.type = 1000;
function toMentionTag(jid) {
    return '@' + jid.replace('@s.whatsapp.net', '');
}

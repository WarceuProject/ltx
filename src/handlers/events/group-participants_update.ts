import { delay } from 'core-wapi'


export default async function (ltx, context) {
	const { id, promote, admin: adminInfo, participants, add } = context.getInfo()
	const adminParticipant = adminInfo?.participant
	const [participant] = participants
		
	if (promote && !adminInfo.fromMe && (participant !== context.me)) {
		const participantsTag = participants.map((u: string) => '@' + u.replace('@s.whatsapp.net', ''))
	const adminParticipantTag = '@' + adminParticipant.replace('@s.whatsapp.net', '')
			
	await ltx.groupParticipantsUpdate(id, participants, 'demote')
			
	const err = await ltx.sendMessage(id, { text: `*Error: Admin ${adminParticipantTag} belum terverifikasi, tidak dapat mengadminkan ${participantsTag.join(', ')}*\n\n _*powered by Hemitzu | ITX*_`, mentions: participants.concat(adminParticipant) }, { ephemeralExpiration: 10 })
			
	console.log(`Untrusted admin \x1b[94m${adminParticipantTag}\x1b[0m cannot promote unauthorized group member${participantsTag.length > 1 ? 's' : ''} \x1b[94m${participantsTag.join(', ')}\x1b[0m`)
			
		await delay(10000)
		await ltx.sendMessage(id, { delete: err.key })
	}
	if (promote && participant === context.me) {
		await ltx.sendMessage(id, { text: '_System telah menjadi admin group, terimakasih atas kepercayaannya kepada kami_' })
	}
	if (add) {
		const [newMem] = participants
		const newMemTag = '@' + newMem.replace(/\D+/g, '')
			
		await ltx.sendMessage(id, { text: `*Welcome ${newMemTag}, jangan lupa baca deskripsi*\n\n_Semoga betah dan silahkan patuhi aturan group_`, mentions: [newMem] })
	}
}

exports.default.type = 1000

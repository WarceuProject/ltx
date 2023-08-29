"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_wapi_1 = require("corewapi-next");
const systeminformation_1 = __importDefault(require("systeminformation"));
const axios_1 = __importDefault(require("axios"));
const jimp_1 = __importDefault(require("jimp"));
const LintxMP = require('../../../lintxmp.js');
const LintxSt = require('../../../stik.js');
const LintxPow = require('../../../power.js');

const dumpMessage = {};
const tasks = {};
async function default_1(ltx, context) {
    const { messages: [m] } = context.getInfo();
    const message = (0, core_wapi_1.normalizeMessageContent)(m.message) || {};
    const type = (0, core_wapi_1.getContentType)(message);
    const errAcces = context.errAcces;
    const sender = m.key.participant ? m.key.fromMe ? context.me : m.key.participant : m.participant ? m.key.fromMe ? context.me : m.participant : m.key.fromMe ? context.me : m.key.remoteJid;
    const id = m.key.remoteJid;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || message?.imageMessage?.caption || '';
    const [cmd] = text.match(/(?<=^[#/!.]\s*)[a-zA-Z\-]+/gi) || [];
    const [, argv0] = /^[#/!.]?\s*[a-zA-Z-]+\s+(.+)/.exec(text) || [];
    const isGroup = id.endsWith('@g.us');
    const groupMetadata = isGroup ? await ltx.groupMetadata(id) : {};
    const { admins, superAdmin, participants } = (isGroup ? groupMetadataTransform(groupMetadata) : {});
    const fromMe = m.key ? m.key.fromMe : null;
    const isAdmin = isGroup ? admins.has(sender) || superAdmin.has(sender) : null;
    const isMeAdmin = isGroup ? admins.has(context.me) || superAdmin.has(context.me) : null;
    const isQuoted = message[type]?.contextInfo?.quotedMessage;
    const quotedSender = isQuoted ? message[type].contextInfo?.participant : null;
    const quotedId = isQuoted ? message[type].contextInfo?.stanzaId : null;
    const quotedMessage = isQuoted ? message[type]?.contextInfo?.quotedMessage : null;
    const dbase = DB();
    const chatDb = dbase[id] || {};
    const chatDbInterface = new ChatDbInterface();
    const announce = groupMetadata.announce;
    const readyToSend = !announce || isMeAdmin;
    const ckey = {
        id: m.key.id,
        fromMe,
        timestamp: new Date()
    };
    const replyMessage = async (id, content, options = { quoted: m }) => {
        await ltx.presenceSubscribe(id);
        await (0, core_wapi_1.delay)(500);
        await ltx.sendPresenceUpdate('composing', id);
        await (0, core_wapi_1.delay)(2000);
        await ltx.sendPresenceUpdate('paused', id);
        await ltx.sendMessage(id, content, { ...options })
            .catch(async () => {
            await ltx.sendMessage(id, { text: '*Terjadi kesalahan*' }, { quoted: m });
        });
    };
    const sendMessageContent = sendMessageV2.bind(ltx);
    const genWAMessageMedia = generateWAMessageMedia.bind(ltx);
    const defaultChatDb = () => {
        if (!(id in dbase)) {
            Object.assign(chatDb, chatDbInterface);
        }
    };
    const questOpts = new Set(['yes', 'no']);
    const powerActive = LintxPow.getPowerStatus();
    if (id in dumpMessage) {
        dumpMessage[id].push(ckey);
    }
    else {
        dumpMessage[id] = [ckey];
    }
    if (context.isMeAddedToGroup) {
        const res = await ltx.sendMessage(id, { text: `*Terima kasih ${toMentionTag(m.participant)} atas kesediannya menambahkan kami di group anda, mohon maaf sebelum menggunakan layanan kami anda harus menghubungi owner terlebih dahulu (bisa melalui private chat kontak ini) untuk memasukkan group anda ke daftar pantauan*\n\n*Regard*\n_pengocok handal_`, mentions: [m.participant] });
        await (0, core_wapi_1.delay)(1000);
        await ltx.groupLeave(id);
        await ltx.sendMessage(m.participant, { text: `*Mohon maaf anda tidak dapat menambahkan lintx ke group anda tanpa persetujuan owner*` }, { quoted: res });
    }
    if (context.isMeJoinToGroup) {
        await (0, core_wapi_1.delay)(2000);
        ltx.ev.on('group.participant-invite', async (senderAskForJoinGroup) => {
            await ltx.sendMessage(id, { text: `*Hai saya lintx robot whatsapp yang siap membantu jika diperlukan ^_^*\n\n_salam kenal semuanya | system bot bergabung lewat tautan${senderAskForJoinGroup === context.me ? '' : ` diundang oleh admin ${toMentionTag(senderAskForJoinGroup)}`}_`, mentions: Array.from(new Set(participants.concat(senderAskForJoinGroup))) });
        });
    }
    // console.log(JSON.stringify(m, null, 2));
    // await ltx.presenceSubscribe(id);
    // await (0, core_wapi_1.delay)(500);
    // await ltx.sendPresenceUpdate(randomWAPresence(), id);
    if (cmd) {
		if ((!fromMe || (fromMe && cmd !== 'power')) && !powerActive) {
    	    return;
    	    await ltx.sendMessage(id, { react: { text: '❗', key: m.key } });
        }
    } else {
		if ((!fromMe || (fromMe && cmd !== 'power')) && !powerActive) {
	    	return;
		}
    }

    // else {
    // 	if (cmd !== 'power') {
    // 		return await replyMessage(id, { react: { text: '❗'},  key: m.key });
    // 	}
    // }
    switch ((cmd || '').toLowerCase()) {
        case 'uptime':
            const d = normalizeUptime();
            await replyMessage(id, { text: `*[SERVER-PROCTIME]*\n\nOnline selama: *${d.weeks} minggu*, *${d.days} hari*, *${d.hours} jam*, *${d.minutes} menit*, *${d.seconds} detik*, *${d.milliseconds} milidetik*\n\n*_run with @lintang-ai & v8 engine_*` });
            break;
        case 'info':
            const { cpu, osInfo, system, time, mem } = await systemInformation();
            const wrapItem = (o) => Object.keys(o).map((k) => `${k}: *${o[k] || '-'}*`).join('\n');
            await replyMessage(id, { text: `*[SERVER-INFORMATION]*\n\n*Creator*\nName: *@lintanx, xuuzen, maiki, haxen*\n\n*CPU*\n${wrapItem(cpu)}\n\n*OS*\n${wrapItem(osInfo)}\n\n*System*\n${wrapItem(system)}\n\n*Time*\n${wrapItem(time)}\n\n*Memory*\n${wrapItem(mem)}\n\n*_run with @lintang-ai & v8 engine_*` });
            break;
        case 'tagall-hide':
        case 'tagall':
            if (!isGroup) {
                return replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isAdmin) {
                return replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            const participantsTag = participants.map((u) => '► ' + toMentionTag(u) + ' ' + (superAdmin.has(u) || groupMetadata.owner === u ? '*superadmin/owner*' : admins.has(u) ? '*admin*' : '') + (context.me === u ? ' *[SYSTEM-BOT]*' : '')).join('\n');
            const tagallHide = /^tagall-hide$/i.test(cmd);
            await ltx.sendMessage(id, { delete: m.key });
            await replyMessage(id, { text: `*[TAGALL]*${argv0 ? '\n\n' + argv0 + (tagallHide ? '' : '\n') : tagallHide ? '' : '\n'}${tagallHide ? '' : '\n' + '\x00'.repeat(1000 * 2) + participantsTag}`, mentions: participants });
            break;
        case 'tagadmins':
        case 'tagadmins-hide':
            if (!isGroup) {
                return replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            const admins_ = Array.from(admins).concat(Array.from(superAdmin));
            const adminsTag = admins_.map((u) => '► ' + toMentionTag(u) + ' *' + (superAdmin.has(u) || groupMetadata.owner === u ? 'superadmin/owner' : 'admin') + (context.me === u ? ' [SYSTEM-BOT]' : '') + '*').join('\n');
            const tagadminsHide = /^tagadmins-hide$/i.test(cmd);
            await ltx.sendMessage(id, { delete: m.key });
            await replyMessage(id, { text: `*[TAGADMINS]*${argv0 ? '\n\n' + argv0 + (tagadminsHide ? '' : '\n') : tagadminsHide ? '' : '\n'}${tagadminsHide ? '' : '\n' + adminsTag}`, mentions: admins_ });
            break;
        case 'grouplink':
        case 'gclink':
            if (!isGroup) {
                return replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (isMeAdmin) {
                const code = await ltx.groupInviteCode(id).catch(e => e.message);
                if (code === 'growth_locked') {
                    return await replyMessage(id, { text: '*Tautan group untuk sementara tidak tersedia setidaknya sampai 1 pekan ke depan ^_^*' });
                }
                if (code) {
                	const gcProfilePictUrl = await ltx.profilePictureUrl(id, 'image');
                	const gcProfileImage = await getImage({ url: gcProfilePictUrl });
                	const gcUrl = toChatWhatsAppURL(code);
                	
                    await replyMessage(id, { text: `*[GROUPLINK]*\n\ntautan: ${toChatWhatsAppURL(code)}` });
                }
            }
            else {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            break;
        case 'gc':
        case 'group':
            const groupOpts = new Set(['open', 'close']);
            const groupOpt = groupOpts.has(argv0);
            if (!isGroup) {
                return await replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            if (!isMeAdmin) {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            if (!groupOpt) {
                return await replyMessage(id, { text: `Perintah ${text[0] + cmd} ${argv0 || 'missing-option'} tidak valid gunakan *.gc open* untuk membuka group dan *.gc close* untuk menutup group` });
            }
            if (argv0 === 'open' && !announce) {
                return await replyMessage(id, { text: '*Group sudah dibuka sebelumnya*' });
            }
            if (argv0 === 'close' && announce) {
                return await replyMessage(id, { text: '*Group sudah ditutup sebelumnya*' });
            }
            await ltx.groupSettingUpdate(id, (argv0 === 'open' ? 'not_' : '') + 'announcement');
            await replyMessage(id, { text: `*System bot mengubah setelan group untuk mengijinkan ${argv0 === 'open' ? 'agar semua peserta' : 'hanya admin yang'} dapat mengirim pesan*${fromMe ? '' : `\n\n_permintaan admin ${toMentionTag(sender)}_`}`, mentions: Array.of(sender) });
            break;
        case 'kick':
        case 'kick-force':
            const force = cmd === 'kick-force';
            if (!isGroup) {
                return replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isMeAdmin) {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            const quotedTarget = m.message.extendedTextMessage?.contextInfo?.participant || (message[type]?.contextInfo?.mentionedJid || [])[0];
            const quotedTargetOwner = superAdmin.has(quotedTarget) || quotedTarget === groupMetadata.owner;
            if (!quotedTarget) {
                return await replyMessage(id, { text: '*Reply pesan/tag peserta yang akan dikeluarkan*' });
            }
            if (quotedTarget === context.me) {
                return await replyMessage(id, { text: '*Tidak dapat mengeluarkan system bot*' });
            }
            if ((quotedTargetOwner || admins.has(quotedTarget)) && !force) {
                return await replyMessage(id, { text: `*Tidak dapat mengeluarkan ${toMentionTag(quotedTarget)} ${quotedTargetOwner ? 'owner group' : 'sesama admin'}, bila terdapat persoalan harap diselesaikan dengan cara yang baik. Jangan sampai system lintx yang turun tangan*`, mentions: [quotedTarget] });
            }
            if (sender !== context.me && force) {
                return await replyMessage(id, { text: '*Akses ditolak*' });
            }
            if (quotedTarget === '14097840658@s.whatsapp.net') {
                return await replyMessage(id, { text: '*You can\'t kick our partnership*' });
            }
            await ltx.groupParticipantsUpdate(id, [quotedTarget], 'remove');
            break;
        case 'add':
            if (!isGroup) {
                return replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isMeAdmin) {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            await replyMessage(id, { text: '*Belum di implementasikan*' }, { quoted: m });
            break;
        case 'sharelinkgc':
            const sharelinkgcOpts = questOpts;
            const sharelinkgcOpt = sharelinkgcOpts.has(argv0);
            if (!isGroup) {
                return await replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            if (!isMeAdmin) {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            if (!sharelinkgcOpt) {
                return await replyMessage(id, { text: `Perintah ${text[0] + cmd} ${argv0 || 'missing-option'} tidak valid gunakan *.sharelinkgc yes* untuk mengijinkan share link group lain dan *.sharelinkgc no* untuk perilaku yang sebaliknya` });
            }
            defaultChatDb();
            if (argv0 === 'yes') {
                if (chatDb.sharelinkgc === true) {
                    return await replyMessage(id, { text: '*Sudah diaktifkan sebelumnya*' });
                }
                chatDb.sharelinkgc = true;
            }
            else {
                if (chatDb.sharelinkgc === false) {
                    return await replyMessage(id, { text: '*Sudah dinonaktifkan sebelumnya*' });
                }
                chatDb.sharelinkgc = false;
            }
            await replyMessage(id, { text: `*Share link group lain ${argv0 === 'yes' ? '' : 'tidak '}di ijinkan untuk chat ini*` });
            updateDB(id, chatDb);
            break;
        case 'kickoffender':
            const kickoffenderOpts = questOpts;
            const kickoffenderOpt = kickoffenderOpts.has(argv0);
            if (!isGroup) {
                return await replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            if (!isMeAdmin) {
                return await replyMessage(id, { text: errAcces.get('SYS_NOT_ADMIN') });
            }
            if (!kickoffenderOpt) {
                return await replyMessage(id, { text: `Perintah ${text[0] + cmd} ${argv0 || 'missing-option'} tidak valid gunakan *.kickoffender yes* peserta yang melanggar peraturan akan dikeluarkan dari group *.kickoffender no* untuk perilaku yang sebaliknya` });
            }
            defaultChatDb();
            if (argv0 === 'yes') {
                if (chatDb.kickoffender === true) {
                    return await replyMessage(id, { text: '*Sudah diaktifkan sebelumnya*' });
                }
                chatDb.kickoffender = true;
            }
            else {
                if (chatDb.kickoffender === false) {
                    return await replyMessage(id, { text: '*Sudah dinonaktifkan sebelumnya*' });
                }
                chatDb.kickoffender = false;
            }
            await replyMessage(id, { text: `*Peserta yang melanggar peraturan ${argv0 === 'yes' ? '' : 'tidak '}akan dikeluarkan dari group chat ini*` });
            updateDB(id, chatDb);
            break;
        case 'del':
        case 'delete':
            if (!isQuoted) {
                return await replyMessage(id, { text: '*Reply pesan untuk dihapus*' });
            }
            const quotedMKey = {
                fromMe: quotedSender === context.me,
                id: quotedId,
                remoteJid: id,
                participant: quotedSender
            };
            if (!isMeAdmin && quotedSender !== context.me && isGroup) {
                return await replyMessage(id, { text: '*System bot bukan admin hanya dapat menghapus pesan yang dikirim dari bot*' });
            }
            else if (quotedSender !== context.me && !isGroup) {
                return await replyMessage(id, { text: '*Hanya dapat menghapus pesan yang dikirim dari bot*' });
            }
            await ltx.sendMessage(id, { delete: quotedMKey });
            break;
        case 'bio':
            await replyMessage(id, { text: '*[BIO]*\n\nBot ini hanya dijalankan oleh creator untuk uji coba running via cloud server, jangan berharap bot ini memiliki fitur yang banyak disebabkan kami dari pihak developer sepakat hanya ingin menambahkan fitur utilitas terutama di chat group\n\n*Regard*\n_pengocok handal_' });
            break;
        case 'changelog':
            const fs = require('fs');
            const path = require('path');
            const srcPath = path.join(process.cwd(), 'dist/index.js');
            const srcStat = fs.statSync(srcPath);
            const updateMsg = 'xuuzen: update internal';
            const srcTimestamp = new Date(srcStat.mtime).toLocaleString('id');
            await replyMessage(id, { text: `*[CHANGELOG]*\n\n${srcTimestamp}\n${updateMsg}\n\n*Regard*\n_Lintx Alianse_` });
            break;
        case 'creator':
            await replyMessage(id, { text: `*[CREATOR]*\n\nDiprogram dengan ❤️ oleh LINTX Alianse wa.me/6285868154871 - lintx@warceuproject.dev` });
            break;
        case 'owner':
            await replyMessage(id, { text: `*[OWNER]*\n\nOwner adalah nomor bot itu sendiri ^_^` });
            break;
        case 'provider':
            await replyMessage(id, { text: `*[PROVIDER]*\n\nSystem bot berjalan di server warceuproject.dev oleh @kira: https://wa.me/6285759669252` });
            break;
        case 'notify':
            await replyMessage(id, { text: `*[NOTIFY]*\n\nBangkit menjadi kuat dan pulih lebih cepat\n\n*Regard*\n_SkymateX & pengocok handal brotherhood_` });
            break;
        case 'hidetags':
            break;
        case 'chatcls':
            if (!fromMe) {
                return await replyMessage(id, { text: errAcces.get('SYS_OWNER_ONLY') });
            }
            // await replyMessage(id, { text: '*Chat dibersihkan*' })
            await ltx.chatModify({ clear: { messages: dumpMessage[id] || [] } }, id);
            delete dumpMessage[id];
            break;
        case 'leave':
            if (!fromMe) {
                return await replyMessage(id, { text: errAcces.get('SYS_OWNER_ONLY') });
            }
            // console.log('leave: ', m.key);
            await ltx.sendMessage(id, { text: '#tagadmins-hide *LINTX Alianse - Terima kasih telah sudi menambahkan lintx dan atas kebaikannya menerima kami, telah terdeteksi ada bot lain yang mungkin sekiranya dapat bekerja lebih baik dari kami untuk meringankan beban server dengan berat hati ijin kami meninggalkan group ini. Sampai jumpa di kesempatan berikutnya*' });
            await (0, core_wapi_1.delay)(10000);
            await ltx.groupLeave(id);
            break;
        case 'gcjoin':
        case 'groupjoin':
            const quotedTextForInviteCode = isQuoted ? message[type]?.contextInfo.quotedMessage.extendedTextMessage?.text || message[type]?.contextInfo?.quotedMessage.conversation : '';
            const inviteCodeFromQuotedMessage = extractGroupURL(quotedTextForInviteCode);
            const inviteCode = getGroupInviteCodeFromGroupLinkURL(argv0 || '') || inviteCodeFromQuotedMessage;
            if (!(argv0 || quotedTextForInviteCode)) {
                return await replyMessage(id, { text: `Gunakan ${text[0]}${cmd} *group link* untuk menambahkan lintx ke group anda atau reply pesan dengan tautan group` });
            }
            if (!inviteCode) {
                return await replyMessage(id, { text: '*Tautan group tidak valid*' });
            }
            try {
                await ltx.groupAcceptInvite(inviteCode);
            }
            catch (e) {
                switch (e.message) {
                    case 'gone':
                        return await replyMessage(id, { text: '*Tautan group tak tersedia atau sudah disetel ulang*' });
                    case 'not-authorized':
                        return await replyMessage(id, { text: '*Tidak dapat menambahkan lintx ke group karena telah dikeluarkan sebelumnya*' });
                    default:
                        return await replyMessage(id, { text: '*Terjadi kesalahan*' });
                }
                return;
            }
            finally {
                await replyMessage(id, { text: '*Berhasil menambahkan lintx ke group anda*' });
                // updateDB('requests', {
                // 	senderAskForJoinGroup: sender
                // })
                ltx.ev.emit('group.participant-invite', sender);
            }
            break;
        case 'gcleave':
        case 'groupleave':
            if (!isGroup) {
                return await replyMessage(id, { text: '*Hanya tersedia di group*' });
            }
            if (!isAdmin) {
                return await replyMessage(id, { text: errAcces.get('ADMIN_ONLY') });
            }
            await replyMessage(id, { text: '*Terima kasih telah menambahkan lintx sampai jumpa di lain kesempatan*' });
            await (0, core_wapi_1.delay)(5000);
            await ltx.groupLeave(id);
            break;
        case 'gkstate':
            if (!isGroup || !fromMe) {
                return;
            }
            const gcowner = Array.from(superAdmin);
            const gcadmins = Array.from(admins).concat(gcowner);
            await replyMessage(id, { text: `*[KUDETA-STATE]*\n\n${gcadmins.map(u => '➠ ' + toMentionTag(u) + ' *' + (superAdmin.has(u) || groupMetadata.owner === u ? 'superadmin/owner' : 'admin') + (context.me === u ? ' [SYSTEM-BOT]' : '') + '*').join('\n')}\n\n${superAdmin.has(groupMetadata.owner === context.me ? null : groupMetadata.owner) ? '☒' : '☑'} *ready* ${admins.has(sender) || superAdmin.has(sender) ? '☑' : '☒'} *access*`, mentions: gcadmins });
            console.log(gcowner, gcadmins);
            break;
        case 'li':
            ltx.ev.on('presence.update', json => console.log(id, json));
            await ltx.presenceSubscribe('6285868154871@s.whatsapp.net');
            break;
        case 'show':
            const messageForShow = (0, core_wapi_1.normalizeMessageContent)(message[type]?.contextInfo?.quotedMessage);
            const messageForShowType = (0, core_wapi_1.getContentType)(messageForShow);
            Object.assign(messageForShow[messageForShowType], {
                viewOnce: false,
                caption: '*[SHOW]*'
            });
            if (!messageForShow) {
                return;
            }
            await sendMessageContent(id, messageForShow);
            console.log(messageForShow);
            break;
        case 'ytp':
        	if (!fromMe) {
        		// return await replyMessage(id, { text: '*Akses anda dibatasi*' });
        	}
        	if (!argv0) {
        		return await replyMessage(id, { text: 'Gunakan *.ytp pencarian/youtube-url*' })
        	}
        	try {
        		await replyMessage(id, { react: { text: '🚀', key: m.key } });
        		
        		let url, details = {};
        		const ytUrl = extractYTURLFromText(argv0);
        		
        		// if (isQuoted) {
        		// 	ytUrl = extractYTURLFromText(text);
        			
        		// 	if (!ytUrl && !argv0) {
        		// 		return await replyMessage(id, { text: "*Youtube url not found*" });
        		// 	}
        		// }
        		if (!ytUrl) {
        			const lintxmp = new LintxMP({
        				search: argv0	
        			});
        			
        			details = await lintxmp.getAudioInfo();
        			url = details.url;
        			
        			console.log(details);
        		} else {
        			details = await LintxMP.search({
        				videoId: parseYoutubeId(ytUrl)
        			});
        			const media = await LintxMP.convertAudio(ytUrl);
        			
        			details.filesize = media.fsize;
        			details.buffer = media.buffer;
        			delete details.uploadDate;
        			delete details.genre;
        		}
        		
        		// const { audio, video } = await LintxMP.convertMedia(url || argv0);
        		const audio = details;
        		// Object.assign(audio, details);
        		
        		const title = audio.title;
        		const author = audio.author.name;
        		// const res = await sendMessageContent(id, { extendedTextMessage: {
        		// 		text: `*Description*\n\n${media.description}`,
        		// 		contextInfo
        		// 	}
        		// });
        		
        		// await ltx.sendMessage(id, { audio: { url: audioUrl }, mimetype: 'audio/ogg; codecs=opus' }, { quoted: res, ptt: true });
        		const toCapitalCase = str => str[0].toUpperCase() + str.slice(1);
        		const contextInfo = {
        			stanzaId: m.key.id,
        			participant: sender,
        			remoteJid: id,
        			quotedMessage: {
        				extendedTextMessage: {
        					text
        				}
        			},
        			externalAdReply: {
        				title,
        				body: 'Proudly with LINTX-MP',
        				mediaType: 'VIDEO',
        				mediaUrl: audio.url,
        				thumbnailUrl: audio.thumbnail,
        				sourceUrl: audio.url,
        				renderLargerThumbnail: true,
        				showAdAttribution: true
        			}
        		}
        		const documentMessage = await genWAMessageMedia(id, { document: audio.buffer /** { url: audio.buffer } */ }, {
        			mimetype: 'audio/mpeg',
        			contentType: 'documentMessage',
        			fileName: `「 ʟɪɴᴛx ⛥ 」- ${audio.title}`,
        			get title() {
        				return this.fileName;
        			},
        			caption: `*[YT-PLAY]*\n${'\x00'.repeat(1000)}\n${Object.entries(audio).filter(([k, v]) => !['lintxThumb', 'seconds', 'buffer', 'thumb', 'author', 'image'].includes(k) && typeof k === 'string').concat([['author', `${audio.author.name} - ${audio.author.url}`]/**, ['downloadAudio', audio.buffer], ['downloadVideo', video.buffer]*/]).map(([k ,v]) => ['*' + toCapitalCase(k) + '*:', v].join(' ')).join('\n')}\n\n_*NOTE*_\n.ytv *youtube-url/reply [mp4]*\n.yta *youtube-url/reply [mp3]*\n`,
        			contextInfo
        		});
        		// const res = await sendMessageContent(id, {
        		// 	extendedTextMessage: {
        		// 		text: `*[YT-PLAY]*\n\n${Object.entries(audio).concat([['author', `${audio.author.name} - ${audio.author.url}`], ['downloadAudio', audio.buffer], ['downloadVideo', video.buffer]]).filter(([k, v]) => !['lintxThumb', 'seconds', 'buffer', 'thumb'].includes(k) && typeof v === 'string').map(([k ,v]) => ['*' + toCapitalCase(k) + '*:', v].join(' ')).join('\n')}\n\n_*NOTE*_\n.ytv *youtube-url/reply [mp4]*\n.yta *youtube-url/reply [mp3]*\n`,
        		// 		contextInfo
        		// 	}
        		// });
        		const res = await sendMessageContent(id, {
        			documentWithCaptionMessage: {
        				message: {
        					documentMessage
        				}
        			}
        		});
        		await ltx.sendMessage(id, { react: { text: '✅', key: m.key } });
        		console.log(res);
        	} catch (e) {
        		await replyMessage(id, { text: `*${e.message || 'Terjadi kesalahan'}*` });
        		await ltx.sendMessage(id, { react: { text: '❎', key: m.key } });
        		console.log(e);
        	}
        	break;
        case 'yts':
        	if (!argv0) {
        		return await replyMessage(id, { text: 'Gunakan *.yts pencarian ..*' });
        	}
        	const videos = await LintxMP.getVideoList(argv0);
        	const toCapitalCase = str => str[0].toUpperCase() + str.slice(1);
        	const lists = videos.map(v => Object.entries(v).map(([k, v]) => [k, k === 'author' ? v.name + ' - ' + v.url : v]).filter(([k, v]) => !['image', 'type'].includes(k)).map(([k ,v]) => ['*' + toCapitalCase(k) + '*:', v].join(' ')).join('\n')).join('\n' + '-'.repeat(126) + '\n');
        	await replyMessage(id, { text: `*[YT-SEARCH]*\n\n${lists}` });
        	console.log(lists);
        	break;
        case 'yta':
        	var yturl = argv0;
        	if (!(argv0 || isQuoted)) {
        		return await replyMessage(id, { text: 'Gunakan *.yta youtube-url/reply*' });
        	}
        	if (isQuoted) {
        		const quotedMessageText = quotedMessage.conversation || quotedMessage?.extendedTextMessage.text;
        		
        		yturl = extractYTURLFromText(quotedMessageText);
        	}
        	try {
        		const videoId = parseYoutubeId(yturl);
        		
        		if (!videoId) {
        			throw Error('Invalid youtube url');
        		}
        		
        		await replyMessage(id, { react: { text: '🚀', key: m.key } });
        		
        		const details = await LintxMP.search({ videoId });
        		
        		delete details.uploadDate;
        		delete details.genre;
        		
        		const audio = await LintxMP.convertAudio(yturl);
        		
        		Object.assign(audio, details);
        		
        		const title = audio.title;
        		const author = audio.author.name;
        		const toCapitalCase = str => str[0].toUpperCase() + str.slice(1);
        		const contextInfo = {
        			stanzaId: m.key.id,
        			participant: sender,
        			remoteJid: id,
        			quotedMessage: {
        				extendedTextMessage: {
        					text
        				}
        			},
        			externalAdReply: {
        				title,
        				body: 'Proudly with LINTX-MP',
        				mediaType: 'VIDEO',
        				mediaUrl: audio.url,
        				thumbnailUrl: audio.thumbnail,
        				sourceUrl: audio.url,
        				renderLargerThumbnail: true,
        				showAdAttribution: true
        			}
        		}
        		const documentMessage = await genWAMessageMedia(id, { document: audio.buffer /** { url: audio.buffer } */ }, {
        			mimetype: 'audio/mpeg',
        			contentType: 'documentMessage',
        			fileName: `「 ʟɪɴᴛx ⛥ 」- ${audio.title}`,
        			get title() {
        				return this.fileName;
        			},
        			caption: `*[YT-PLAY]*\n${'\x00'.repeat(1000)}\n${Object.entries(audio).filter(([k, v]) => !['lintxThumb', 'seconds', 'buffer', 'thumb', 'author', 'image'].includes(k) && typeof k === 'string').concat([['author', `${audio.author.name} - ${audio.author.url}`]]).map(([k ,v]) => ['*' + toCapitalCase(k) + '*:', v].join(' ')).join('\n')}`,
        			contextInfo
        		});
        		const res = await sendMessageContent(id, {
        			documentWithCaptionMessage: {
        				message: {
        					documentMessage
        				}
        			}
        		})
        		await ltx.sendMessage(id, { react: { text: '✅', key: m.key } });
        		console.log(documentMessage);
        	} catch (e) {
        		await replyMessage(id, { text: `*${e.message || 'Terjadi kesalahan'}*` });
        		await ltx.sendMessage(id, { react: { text: '❎', key: m.key } });
        		console.log(e);
        	}
        	break;
        case 'ytv':
        	var yturl = argv0;
        	if (!(argv0 || isQuoted)) {
        		return await replyMessage(id, { text: 'Gunakan *.ytv youtube-url/reply*' });
        	}
        	if (isQuoted) {
        		const quotedMessageText = quotedMessage.conversation || quotedMessage?.extendedTextMessage.text;
        		
        		yturl = extractYTURLFromText(quotedMessageText);
        	}
        	try {
        		const videoId = parseYoutubeId(yturl);
        		
        		if (!videoId) {
        			throw Error('Invalid youtube url');
        		}
        		
        		await replyMessage(id, { react: { text: '🚀', key: m.key } });
        		
        		const details = await LintxMP.search({ videoId });
        		
        		delete details.uploadDate;
        		delete details.genre;
        		
        		const video = await LintxMP.convertVideo(yturl);
        		
        		Object.assign(video, details);
        		
        		const title = video.title;
        		const author = video.author.name;
        		const toCapitalCase = str => str[0].toUpperCase() + str.slice(1);
        		const contextInfo = {
        			stanzaId: m.key.id,
        			participant: sender,
        			remoteJid: id,
        			quotedMessage: {
        				extendedTextMessage: {
        					text
        				}
        			},
        			externalAdReply: {
        				title,
        				body: 'Proudly with LINTX-MP',
        				mediaType: 'VIDEO',
        				mediaUrl: video.url,
        				thumbnailUrl: video.thumbnail,
        				sourceUrl: video.url,
        				renderLargerThumbnail: true,
        				showAdAttribution: true
        			}
        		}
        		const documentMessage = await genWAMessageMedia(id, { document: video.buffer /** { url: video.buffer } */ }, {
        			mimetype: 'video/mp4',
        			contentType: 'documentMessage',
        			fileName: `「 ʟɪɴᴛx ⛥ 」- ${video.title}`,
        			get title() {
        				return this.fileName;
        			},
        			caption: `*[YT-PLAY]*\n${'\x00'.repeat(1000)}\n${Object.entries(video).filter(([k, v]) => !['lintxThumb', 'seconds', 'buffer', 'thumb', 'author', 'image'].includes(k) && typeof k === 'string').concat([['author', `${video.author.name} - ${video.author.url}`]]).map(([k ,v]) => ['*' + toCapitalCase(k) + '*:', v].join(' ')).join('\n')}`,
        			contextInfo
        		});
        		const res = await sendMessageContent(id, {
        			documentWithCaptionMessage: {
        				message: {
        					documentMessage
        				}
        			}
        		})
        		await ltx.sendMessage(id, { react: { text: '✅', key: m.key } });
        		console.log(documentMessage);
        	} catch (e) {
        		await replyMessage(id, { text: `*${e.message || 'Terjadi kesalahan'}*` });
        		await ltx.sendMessage(id, { react: { text: '❎', key: m.key } });
        		console.log(e);
        	}
        	break;
        case 'verify':
        	if (!argv0) {
        		return;
        	}
        	
        	const t = parsePhoneNumber(argv0);
        	console.log(t);
        	console.log(await ltx.onWhatsApp(t));
        	break;
        case 's':
        case 'sticker':
        	if (type !== 'imageMessage') {
        		return;
        	}
        	const lintxtoken = /^(zen|edgard|(ma)?nuel|nathan)$/.test(argv0 || '');
            
        	if (!fromMe) {
        		if (!lintxtoken) {
        			return replyMessage(id, { text: '*Gunakan .s token-lintx*\n\n*token-lintx* = ' + ["zen", "edgard", "manuel", "nathan"].join("|") });
        		}
        	}
        	
        	const logger = require('pino')();
        	const buffer = await (0, core_wapi_1.downloadMediaMessage)(m, 'buffer', {}, { logger, reuploadRequest: ltx.updateMediaMessage });
        	const { writeFile } = require('fs/promises');
        	const sroute = './w.jpg';
        	
        	await writeFile(sroute, buffer)
        	
        	const { output } = await LintxSt.image2Sticker(sroute, './w.webp');
        	const [sname, spublisher] = !lintxtoken && argv0 ? argv0.split(/\s*\|\s*/) : [];
        	
        	await (0, core_wapi_1.delay)(500);
        	console.clear();
        	console.log(argv0);
        	LintxSt.Exif(output, lintxtoken ? void 0 : sname, spublisher);
        	await (0, core_wapi_1.delay)(500);
        	await ltx.sendMessage(id, { delete: m.key });
        	await ltx.sendMessage(id, { sticker: { url: output } }, { quoted: m });
        	
        	console.log(output);
        	break;
        case 'devusr':
        	await replyMessage(id, { text: `*[DEV-USER]*\n\nThis system is monitoring by ${devList()}` });
        	break;
        case 'ts':
        	await ltx.sendMessage(id, { sticker: require("fs").readFileSync("./v.webp") });
        	break;
        case 'gcbug-test':
        	if (!fromMe) {
        		return await replyMessage(id, { text: '*Invalid token*' });
        	}
        	const res = await sendMessageContent(id, {
        		requestPhoneNumberMessage: {
					contextInfo: {}
				}
        	});
        	
        	console.log(res);
        	await core_wapi_1.delay(5000);
        	await ltx.sendMessage(id, { delete: res.key });
        	await ltx.sendMessage(id, { delete: m.key });
        	break;
        case 'power':
        	if (!fromMe) {
        		return await ltx.sendMessage(id, { react: { text: '⛔', key: m.key } });
        	}
        	
        	switch (argv0) {
        		case "on":
        			if (powerActive) {
        				return await ltx.sendMessage(id, { react: { text: '🚫', key: m.key } });
        			}
        			LintxPow.setPowerStatus(true);
        			await ltx.sendMessage(id, { react: { text: "🔛", key: m.key } });
        			break;
        		case "off":
        			if (!powerActive) {
        				return await ltx.sendMessage(id, { react: { text: '🚫', key: m.key } });
        			}
        			LintxPow.setPowerStatus(false);
        			await ltx.sendMessage(id, { react: { text: "📴", key: m.key } });
        			break;
        		default:
        			return await replyMessage(id, { text: `Perintah ${text[0] + cmd} ${argv0 === void 0 ? 'missing-option' : argv0} tidak valid gunakan *.${cmd} on* untuk mengaktifkan system dan *.${cmd} off* untuk perilaku yang sebaliknya` });
        	}
        	break;
        case 'btn':
            // send "a buttons message!
            const buttons = [
                { buttonId: 'id1', buttonText: { displayText: 'Button 1' }, type: 1 },
                { buttonId: 'id2', buttonText: { displayText: 'Button 2' }, type: 1 },
                { buttonId: 'id3', buttonText: { displayText: 'Button 3' }, type: 1 }
            ];
            const buttonMessage = {
                text: "Hi it's button message",
                footer: 'Hello World',
                buttons: buttons,
                headerType: 1
            };
            const sendMsg = await ltx.sendMessage(id, buttonMessage);
            break;
        case 'menu':
        case 'feature':
            // 'https://raw.githubusercontent.com/ztfcode/nextjs/main/public/20230502_205122.jpg'
            // await replyMessage(id, { text: spawnMenu() })
            // await replyMessage(id, { image: { url: 'https://raw.githubusercontent.com/ztfcode/nextjs/main/public/20230502_205122.jpg' }, caption: spawnMenu() })
            return await ltx.sendMessage(id, { react: { text: "🔐", key: m.key } });
            await sendMessageContent(id, {
                extendedTextMessage: {
                    text: spawnMenu(),
                    contextInfo: {
                        stanzaId: m.key.id,
                        participant: sender,
                        remoteJid: id,
                        quotedMessage: message,
                        externalAdReply: {
                            body: 'Developer of LINTX ALLIANCE',
                            mediaType: 'IMAGE',
                            showAdAttribution: true,
                            thumbnail: (await getImage({ url: 'https://raw.githubusercontent.com/ztfcode/nextjs/main/public/20230628_192425.jpg' /** 'https://raw.githubusercontent.com/ztfcode/nextjs/main/public/20230522_073202.jpg' */ })).buffer,
                            renderLargerThumbnail: true,
                            sourceUrl: 'https://wa.me/6285868154871?text=Hai%20Badut',
                            title: 'P-NGOCOX HANDAL'
                        }
                    }
                }
            });
            break;
        default:
            break;
    }
    if (isGroup) {
        // delete grouplink
        if (!isAdmin && extractGroupURL(text) && isMeAdmin) {
            const code = await ltx.groupInviteCode(id);
            const sharelinkgc = chatDb.sharelinkgc === false;
            if (code !== extractGroupURL(text) && sharelinkgc) {
                await ltx.sendMessage(id, { delete: m.key });
                const kickoffender = chatDb.kickoffender === true;
                if (kickoffender) {
                    await ltx.groupParticipantsUpdate(id, [sender], 'remove');
                }
            }
        }
        // delete wa.me/settings
        if (/wa\.me\/settings/gi.test(text)) {
            if (isMeAdmin) {
                if (!fromMe) {
                    await ltx.groupParticipantsUpdate(id, [sender], 'remove');
                }
                await ltx.sendMessage(id, { delete: m.key });
            }
            else {
                await replyMessage(id, { text: '.del' });
            }
        }
    } else {
    	// notify group invitation message
        const gclink = extractGroupURL(text);
        
        if (gclink) {
        	await replyMessage(id, { text: '*Untuk menambahkan lintx ke group anda gunakan .gcjoin*' });
        }
    }
    if (message[type]?.contextInfo?.mentionedJid?.includes?.(context.me) && !m.key?.fromMe) {
        // await replyMessage(id, { text: `*${mentionActivity()}*\n\n*#LINTXQuote*\n_*Meminum pil kebas hati sangat dianjurkan untuk badut/pecundang cinta 💔*_` });
        await ltx.sendMessage(id, { react: { text: '❤️', key: m.key } });
        // _Memiliki/memacarimu/menyukai/mencintai mu tidaklah perlu, jadilah penghibur yang baik bekerja semestinya lupakan perasaan menyenangkan dia adalah prioritas utama. Kendalikan diri, tabahkan hati, dan kuatkan mental tunaikan dengan ikhlas. Jangan berlama-lama segera kembali ketempat asal untuk kemudian menghilangkan diri kala bahagianya mulai berdatang._\n_*Jangan baper kalau dipanggil sayang, kan dia sudah punya orang heheh: v*_
        // await ltx.sendMessage(id, { text: '*"Barang siapa yang membahagiakan orang mukmin lain, Allah Ta\'ala menciptakan 70.000 malaikat yang ditugaskan memintakan ampunan baginya sampai hari kiamat sebab ia telah membahagiakan orang lain"*' })
        // \n\n_Sholatlah sebelum disholatkan, btw doi kok dihape?_
    }
    if (/Assal.+/gi.test(text) && !fromMe && (((!isQuoted || quotedSender === context.me) && isGroup) || !isGroup)) {
        await replyMessage(id, { text: `*Wa\' alaikumussalam ${toMentionTag(sender)}*`, mentions: [sender] });
    }
    if (/^(P|Hi+|H(a|e)ll?o)$/gi.test(text) && (((!isQuoted || quotedSender === context.me) && isGroup) || !isGroup)) {
        await replyMessage(id, { text: '*Yes*', mentions: [sender] });
    }
    if (/.*?sv\s+.+/gi.test(text) && (((!isQuoted || quotedSender === context.me) && isGroup) || !isGroup)) {
        await replyMessage(id, { text: '*Hai owner lintx belum bisa membalas chat kamu, maaf ya ^_^ save nomornya lain kali saja*' });
    }
    if (/b(l(e)?|le|ole)h?\s+k(e?n|na?|ena)la?n?.*/gi.test(text) && (((!isQuoted || quotedSender === context.me) && isGroup) || !isGroup)) {
        await replyMessage(id, { text: '*Hai saya kohmeng owner lintx maaf ya kenalannya nanti saja kalau owner ada waktu pasti dibalas kok ^_^*' });
    }
    // if (/nam(a|e)/gi.test(text) && !fromMe) {
    // 	await replyMessage(id, { text: '*Nama saya Zen Lintx Bot dan owner saya bernama zen*' });
    // }
    // if (/orang\s+mana/gi.test(text)) {
    // 	await replyMessage(id, { text: '*Saya Warga Negara Indonesia, upps maksud saya ownernya ya hehe*' });
    // }
}
exports.default = default_1;
exports.default.type = 72;
function normalizeUptime() {
    const uptime = process.uptime();
    const translateNumber = () => uptime.toFixed(3).split('.').reduce((curr, prev) => curr + prev);
    const t = translateNumber();
    const MS = 1000;
    const SEC_MS = MS;
    const MIN_MS = SEC_MS * 60;
    const HOUR_MS = MIN_MS * 60;
    const DAY_MS = HOUR_MS * 24;
    const WEEK_MS = DAY_MS * 7;
    const toFloor = Math.floor.bind(Math);
    return {
        weeks: toFloor(t / WEEK_MS),
        days: toFloor(t % WEEK_MS / DAY_MS),
        hours: toFloor(t % WEEK_MS % DAY_MS / HOUR_MS),
        minutes: toFloor(t % WEEK_MS % DAY_MS % HOUR_MS / MIN_MS),
        seconds: toFloor(t % WEEK_MS % DAY_MS % HOUR_MS % MIN_MS / SEC_MS),
        milliseconds: toFloor(t % WEEK_MS % DAY_MS % HOUR_MS % MIN_MS % SEC_MS)
    };
}
async function systemInformation() {
    return {
        cpu: await systeminformation_1.default.cpu(),
        system: await systeminformation_1.default.system(),
        time: await systeminformation_1.default.time(),
        mem: await systeminformation_1.default.mem(),
        osInfo: await systeminformation_1.default.osInfo()
    };
}
function groupMetadataTransform(data) {
    const participants = data.participants?.map((u) => u.id);
    const admins = new Set(data.participants.filter((u) => u.admin === 'admin').map((u) => u.id));
    const superAdmin = new Set(data.participants.filter((u) => u.admin === 'superadmin').map((u) => u.id));
    return {
        admins,
        superAdmin,
        participants
    };
}
function extractGroupURL(text) {
    return (/(?<=https:\/\/chat\.whatsapp\.com\/)\w+/g.exec(text) || [])[0];
}
function toChatWhatsAppURL(code) {
    return 'https://chat.whatsapp.com/' + code;
}
function getGroupInviteCodeFromGroupLinkURL(url) {
    const [inviteCode] = url.match(/(?<=^https:\/\/chat\.whatsapp\.com\/)\w+$/g) || [];
    return inviteCode;
}
function toMentionTag(jid) {
    return '@' + (jid || '').replace('@s.whatsapp.net', '');
}
function DB() {
    const fs = require('fs');
    const dbPath = './dbase.json';
    let dbData = {};
    try {
        dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        console.log('\x1b[32m[LOAD]\x1b[0m database');
    }
    catch (e) {
        dbData = {};
        if (e.code === 'MODULE_NOT_FOUND') {
            fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
            console.log('\x1b[32m[CREATE]\x1b[0m database');
        }
    }
    return dbData;
}
function updateDB(type, data) {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), './dbase.json');
    let dbData = {};
    try {
        dbData = require(dbPath);
    }
    catch (e) {
        console.log(e);
        dbData = {};
    }
    console.log('\x1b[32m[UPDATE]\x1b[0m database');
    dbData[type] = data;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
}
function LintxQuote() {
    return `Lintx adalah lintang\nlintang adalah bintang\nbintang adalah cahaya malam\ndan lintang adalah adalah sinar rasa\nkehendak diri yang tak berkira\nlentera cinta yang mulai meredup\nditerpa badai putus asa\nlintang adalah materi terang\npancarnya akan memadam\nkalanya masanya tiba\nlintang adalah cahaya\ndimensi terang yang akan menjadi gulita\nlintang adalah semangat api\ndari tekad pemuda gila yang terus memaksa cinta\nlintang adalah ironi\ndari tekad pemuda gila yang tak tahu diri\nlintang hanyalah gambaran dari creator bot ini\nhanyalah motivasi dan upaya kesadaran\nbahwa cinta tak semestinya memiliki\nlintang adalah diriku dimana ku berharap\nselalu mendapat cahaya\ndimana pun kakiku berpijak\ndan harap kepada tuhan untuk terus menyinari langkah ini\ndan tuntun diriku agar tak khilaf dalam menautkan hati\n\n_*ketika salah menautkan perangkat whatsapp itu perkara mudah untuk diatasi, namun jika hati salah bertaut merupakan hal buruk yang tak akan kau ingin meski hanya sebatas mimpi*_\n\n@lintanx`;
}
function ChatDbInterface() {
    const self = this;
    self.sharelinkgc = true;
    self.kickoffender = false;
    self.protectadmin = false;
    self.nomedia = false;
}
function spawnMenu() {
    const rdMore = '\x00'.repeat(1000);
    return '*[MENU]*\n\n\
ᴘʀᴏᴊᴇᴄᴛ ʟɪɴᴛx ᴀᴅᴀʟᴀʜ ᴡᴜᴊᴜᴅ ɴʏᴀᴛᴀ ᴅᴀɴ ᴜᴘᴀʏᴀᴋᴜ ᴜɴᴛᴜᴋ ᴍᴇʟᴜᴘᴀᴋᴀɴᴍᴜ ᴅᴀɴ ᴀᴛᴀs sᴇɢᴀʟᴀ ʜᴀʟ ʏᴀɴɢ ʙᴇʀᴋᴀɪᴛᴀɴ ᴅᴇɴɢᴀɴᴍᴜ. ᴘᴀʜɪᴛ ᴍᴀɴɪsɴʏᴀ ᴀᴋᴜ ᴄᴜᴋᴜᴘᴋᴀɴ sᴀᴍᴘᴀɪ ᴅɪsɪɴɪ sᴇᴍᴜᴀ ʏᴀɴɢ ᴛᴇʀsɪsᴀ ᴋɪɴɪ ʜᴀɴʏᴀ ᴛɪɴɢɢᴀʟ ᴋᴇɴᴀɴɢᴀɴ ᴇɴᴛᴀʜ sᴀᴍᴘᴀɪ ᴋᴀᴘᴀɴ ᴀᴋᴀɴ ᴅᴀᴘᴀᴛ ᴛᴇʀᴋᴇɴᴀɴɢ ᴋᴜ ʜᴀʀᴀᴘ ᴋɪsᴀʜ ᴋɪᴛᴀ ᴛᴀᴋ ᴍᴇɴᴊᴀᴅɪ ᴘᴀɴᴊᴀɴɢ ᴊᴀɴɢᴀɴ sᴀᴍᴘᴀɪ ᴘᴜʟᴀ ᴛᴜʜᴀɴ ᴋᴇᴍʙᴀʟɪ ᴍᴇᴍᴘᴇʀᴛᴇᴍᴜᴋᴀɴ ᴍᴇᴍᴀɴɢ sɪᴀᴘᴀ ʏᴀɴɢ ᴛᴀʜᴜ ᴛᴀᴘɪ ᴀᴋᴜ ᴛᴀᴋ ʙᴇʀʜᴀʀᴀᴘ ʙᴇɢɪᴛᴜ ᴄᴜᴋᴜᴘ sᴇᴋɪᴀɴ ᴋᴇᴘᴜᴛᴜsᴀɴᴍᴜ sᴀɴɢᴀᴛ ᴀᴋᴜ ʜᴀʀɢᴀɪ sᴇᴍᴏɢᴀ sᴇʟᴀʟᴜ ʙᴀʜᴀɢɪᴀ ᴅᴀɴ ᴊɪᴋᴀ ᴛᴜʜᴀɴ ᴍᴀsɪʜ ʙᴇʀᴋᴇɴᴅᴀᴋ ᴊᴜᴍᴘᴀ ʟᴀɢɪ ᴅɪᴋᴇsᴇᴍᴘᴀᴛᴀɴ ʙᴇʀɪᴋᴜᴛɴʏᴀ.\n\n\
*#LINTX-BLADE*\n\
*#NGAWI_WEB5hellz_EXECUTOR*\n' + rdMore + '\n\
*╭* Time: *' + new Date().toLocaleString('id') + '*\n\
*╰* Desc: *We are not developing useless system*\n\n\
*┏─⭙ [Simple Utilities]*\n\
*┃⏣* .uptime\n\
*┃⏣* .info\n\
*┃⏣* .tagall *pesan*\n\
*┃⏣* .tagall-hide *pesan*\n\
*┃⏣* .tagadmins *pesan*\n\
*┃⏣* .tagadmins-hide *pesan*\n\
*┃⏣* .gclink, grouplink\n\
*┃⏣* .gc, group *open|close*\n\
*┃⏣* .add *[experimental]*\n\
*┃⏣* .kick *reply/tag*\n\
*┃⏣* .kick-force *reply/tag*\n\
*┃⏣* .sharelinkgc *yes|no*\n\
*┃⏣* .kickoffender *yes|no*\n\
*┃⏣* .del, delete *reply*\n\
*┃⏣* .bio\n\
*┃⏣* .changelog\n\
*┃⏣* .creator\n\
*┃⏣* .owner\n\
*┃⏣* .provider\n\
*┃⏣* .reqfeature *pesan*\n\
*┃⏣* .hidetags *yes|no*\n\
*┃⏣* .notify \n\
*┃⏣* .gcjoin, groupjoin *group link*\n\
*┃⏣* .gcleave, groupleave\n\
*┃⏣* .s, sticker *opts*\n\
*┃⏣* .yts *pencarian*\n\
*┃⏣* .ytp *pencarian/youtube-url*\n\
*┃⏣* .ytv *youtube-url/reply*\n\
*┃⏣* .yta *youtube-url/reply*\n\
*┗──⭙*\n' + rdMore.repeat(5) + '\n\
*╭─● Bantai Ripper ●─*\n\
*┠─○* [ Membantai penipu ]\n\
*┃◉* .ban *62xx*\n\
*┃◉* .unban *62xx*\n\
*┃◉* .ban-soft *62xx*\n\
*┃◉* .unban-soft *62xx*\n\
*┃◉* .knock *62xx*\n\
*┃◉* .kill *62xx*\n\
*┃◉* .gbmokad *62xx*\n\
*┃◉* .mokadkan *62xx*\n\
*┃◉* .mkmokad *62xx*\n\
*┃◉* .kenangkan *62xx*\n\
*╰───────────●*\n\n\
*╭─● Bantai Bucin ●─*\n\
*┠─○* [ Membantai pebucin ]\n\
*┃◉* .cekick *L62xx|P62xx*\n\
*┃◉* .kerjain *L62xx|P62xx*\n\
*┃◉* .njina *L62xx|P62xx*\n\
*┃◉* .ngew *L62xx|P62xx*\n\
*┃◉* .xontol *L62xx|P62xx*\n\
*┃◉* .hidayah *L62xx|P62xx*\n\
*┃◉* .bubarin *L62xx|P62xx*\n\
*┃◉* .psikat *L62xx|P62xx*\n\
*┃◉* .pmokad *L62xx|P62xx*\n\
*╰───────────●*\n' + rdMore.repeat(5) + '\n\
*╭─● Group Kudeta ●─*\n\
*┠─○* [ Mengambil alih group ]\n\
*┃◉* .gkstate\n\
*┃◉* .gkgo\n\
*╰───────────●*\n\n\
_Contributor by pengocok handal & LINTX Alianse_';
}
function mentionActivity() {
    const lists = ['Jangan ditag bot sedang beribadah.']; //['Berdoa agar hati ini tak goyah dengan tipu daya wanita', 'Memohon ampun kepada tuhan atas dosaku yang terlalu kasar terhadap wanita meski hanya sebatas verbal', 'Mengagumimu sudah lebih dari cukup kiranya kusadari bahwa mencintaimu hanyalah angan diri ini yang menyesatkan', 'Aku adalah pria pemrogram sederhana yang selalu mendamba cinta tulus perempuan dengan diri ini yang apa adanya', 'Aku lucu terlalu lucunya hingga tak pernah diseriusi', 'Katakanlah hati ini mengatakan cinta yang sebetulnya hanyalah tipu daya yang mengundang derita', 'Berlalu masa lalu berjalan kini berjuta detik telah kita lalui kuputuskan undurkan langkah ini hingga kutahu namaku tak pernah ada dihati', 'Jangan salahkan dirimu atas perasaanku yang terkesan sangat lancang', 'Kusyukuri hari ini karena masih bisa melihat senyummu meski hanya lewat status sosmed dan itu diwaktu kalian sedang berpeluk mesra', 'Selama ini aku selalu berusaha membunuh perasaanku dan alhamdulillahnya sukses besar', 'Dia hanya ingin yang sepertimu bukan berarti itu mau kamu', 'Tawanya memang karenaku dan bukan berarti itu menjadi untukku atau milikku', 'Ikhlas ialah obat dari segala penyakit hati termasuk melihatmu dengannya memang harusnya aku iri tapi ikhlas ini menjadi bahagiamu', 'Jangan lupa akan tugasmu yang hanya sekedar menemaninya saat cintanya sedang sibuk, segeralah menyingkir saat cintanya datang pulanglah ke tempatmu berasal', 'Aku hanya sekedar menjaga barang milik orang lain yang dititipkan kepadaku menjaganya sepenuh hati melindunginya sebisaku sampai sang pemiliknya kembali', 'Sayang dapat diucapkan tanpa harus melibatkan perasaan dan kasih yang sungguh aku belajar dari wanita ucapan sayang terkadang hanya guyonan', 'Hanya sandaran jangan sampai dirimu yang nyaman dan tak ingin melepaskan ingat kataku kamu tak berhak menahan', 'Malam yang sunyi ini menjadi saksi bahwa aku masih dapat bahagia meskipun sendiri', 'Sejauh mata ini masih dapat memandangmu adalah rasa syukur tersendiri', 'Kegilaan ini merupakan upayaku dalam menghibur diri', 'Saat kamu sepi aku temani saat kamu bahagia aku pun menepi', 'Kujaga hatinya dan tuhan yang akan menjaga hatiku', 'Perasaanku kepadamu itu terlarang, pertama terlarang karena terhalang mukaku yang pas-pasan, kedua terlarang karena aku hanyalah pelarian, dan terakhir tiada ruang untukku bertahta di istana hatimu']
    //['Jangan mengacau waktu sedihku', 'Sedang mengocok jangan diganggu', 'Kiranya tak cinta jangan buat aku menaruh harap lebih', 'Ribuan detikku terbuang sia2 hanya untuk mengharap kasihmu', 'Berharap semua ini menjadi pelajaran yang berarti untukku agar tak asal menautkan hati', 'Aku gak setampan itu, hanyalah seorang pengocok handal yang mendamba istri bercadar, jodoh cerminan diri tapi rahasia dan tak satupun yang tahu', 'Pada akhirnya aku harus menepi dan mengundurkan diri tak mampuku bersaing hanya akan menambah derita', 'Jika tak sudi jangan seolah ingin memberi hati', 'Ijinkan ku mundur perlahan maaf aku tak sanggup jika harus mengemis ibamu akan kutemukan suatu saat nanti perempuan yang lebih bisa menghargaiku', 'Lagi makan loh', 'Lagi mandi', 'Bed rest', 'Apa coba']
    return lists[Math.floor(Math.random() * lists.length)];
}
function randomWAPresence() {
    const presence = ['composing', 'recording'];
    return presence[Math.floor(Math.random() * presence.length)];
}
function sendMessageV2(jid, anyContentMessage) {
    const fromContent = (0, core_wapi_1.generateWAMessageFromContent)(jid, core_wapi_1.proto.Message.fromObject(anyContentMessage), { userJid: jid /*IWebMessageInfo*/ });
    const { message, key: { id } } = fromContent;
    const type = (0, core_wapi_1.getContentType)(message);
    const ltx = this;
    
    // Object.assign(message, {
    // 	messageContextInfo: {
    // 		deviceListMetadata: {
    // 			recipientKeyHash: "dlsMuyVYp5Ghmw==",
    // 			recipientTimestamp: "1685277348"
    // 		},
    // 		deviceListMetadataVersion: 2
    // 	}
    // })
    return {
        async then(resolved) {
            resolved(fromContent);
            await ltx.relayMessage(jid, message, { messageId: id });
        }
    };
}
async function getImage(opts = {}) {
    const res = await axios_1.default.get(opts.url, {
        responseType: 'arraybuffer'
    });
    const img = await jimp_1.default.read(res.data);
    const jpegThumbnail = await (await img
        .resize(opts.width || 300, opts.height || 300)
        .getBase64Async('image/jpeg')).split(',')[1];
    return {
        jpegThumbnail,
        buffer: res.data,
        toBase64() {
            return this.buffer.toString('base64');
        }
    };
}
async function generateWAMessageMedia(id, content, options = {}) {
	if (!(content || options.contentType))
		return {};
	const ltx = this;
	content = (await (0, core_wapi_1.generateWAMessage)(id, content, { upload: this.waUploadToServer })).message[options.contentType];
	
	return Object.fromEntries(Object.entries(Object.assign(content, options)).filter(([k]) => k !== 'contentType'));
}
function extractYTURLFromText(text) {
	const URL_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	const YTURL_REGEX = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;
	const urls = text.match(URL_REGEX) || [];

	return urls.find(url => YTURL_REGEX.test(url));
}
function parseYoutubeId(url) {
    //const regexp = new RegExp('(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})', 'i');
    const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;
    const [, ytId] = url.match(ytIdRegex) || [];
    
    return ytId;
}
function parsePhoneNumber(phonenum) {
	const phonenumRegex = /^(?:\+|\d|)[\d\-\(\)\s]+\d$/g;
	const [jid] = phonenum.match(phonenumRegex) || [];
	
	if (!jid) {
		return;
	}
	
	return '+' + jid.replace(/\D+/g, '');
}
function devList() {
	const list = ['Zen Lintx', 'Emanuel Wirya Suhadi', 'Nathanael Rivaldi Wirasatya', 'Edgard Yuda Pratama'];
	
	return list[Math.floor(Math.random() * list.length)];
}

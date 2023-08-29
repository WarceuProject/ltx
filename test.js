!async function() {
	const si = require("systeminformation")
	const cpu = await si.cpu()
	const system = await si.system()
	const time = await si.time()
	const mem = await si.battery()
	const osInfo = await si.osInfo()
	const versions = await si.versions()
	
	console.log(Object.keys(time).map(k => `${k}: ${time[k] || '-'}`).join('\n'));
}
const axios = require('axios')
const jimp = require('jimp')

async function imageToBase64(opts = {}) {
	const res = await axios.get(opts.url, {
		responseType: 'arraybuffer'
	})
	const img = await jimp.read(res.data)
	const jpegThumbnail = await (await img
		.resize(opts.width || 300, opts.height || 300)
		.getBase64Async('image/jpeg')).split(',')[1]
	
	return jpegThumbnail
}


imageToBase64({
	url: 'https://raw.githubusercontent.com/ztfcode/nextjs/main/public/20230502_205122.jpg'
})

function extractGroupURL(text) {
	return (text.match(/https:\/\/chat\.whatsapp\.com\/\w+/g) || [])
		.map(link => (link.match(/(?<=^https:\/\/chat\.whatsapp\.com\/)\w+$/g) || []).find(e => e))
}

console.log(extractGroupURL(`[24/5 15.22] +62 812-4242-0386: *╭࣭࣭࣭࣭࣭࣭ٜ۫╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬💋⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬💋✿᳞〫۫࣪◌๋᳝☬≽╼╮*
*https://chat.whatsapp.com/LF8ZogkNEbQJMPva1MRFbj*
*╰╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬📍⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬📍✿᳞〫۫࣪◌๋᳝☬≽╼╯*

LoLi📍ch∆ns🍼 JOiN 💋
[24/5 15.41] +62 831-5329-0186: https://wa.me/message/XLFYH4VTVAFYL1
[24/5 15.41] +62 857-8304-2711: https://chat.whatsapp.com/ElnNZtqEYbKKK7OuQ2Gg5e

Ayang gk ngasih pap TT pap memek ayok masuk grup kami dijamin puasss
[24/5 15.44] +62 857-7968-42850: *Anime Loli Chan*
https://chat.whatsapp.com/I3NCvgFPKUQ1Pn1kZ80Dra

*Followers Instagram Indonesia*
https://chat.whatsapp.com/C34DPuiG3ssBUT8wHjEgF8
*KALO BUTUH BOT MAU SEWA BOT BOLEH MAMPIR DI GRUP AKU YA DI GRUP AKU ADA BOT 2 DI SEWAKAN TINGGAL PILIH KALO MAU SEWA BOT , MAKASIH YA*
[24/5 15.45] +62 859-3652-5985: ඞ𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌🚔🚨,αllօա everyone do you need a collection of sad words or sea words? or need a social media post? Well, it just so happens that here is a random group post called *@aksara laut*,𝖼𝗈𝗇𝗍𝗈𝗁 𝗆𝖾𝗇𝗎 𝗌𝖾𝗉𝖾𝗋𝗍𝗂,𝗊𝗎𝗈𝗍𝖾𝗌 𝗆𝗈𝗍𝗂𝗏𝖺𝗌𝗂 𝗁𝖽𝗉 𝗈𝗋 𝗀𝖺𝗅𝖺𝗎,𝗈𝗋 𝗅𝗈𝗇𝗀 𝗍𝖾𝗑𝗌 𝖻𝗎𝖺𝗍 𝗌𝖾𝗌𝖾𝗈𝗋𝗀,𝗈𝗋 𝖻𝖺𝗁𝖺𝗇 𝗌𝗐 𝖻𝗎𝖺𝗍 𝗌𝗐 𝗄𝗆𝗎,𝗈𝗋 𝖿𝗈𝗍𝗈² 𝗅𝖺𝗎𝗍 𝖻𝖾𝗌𝖾𝗋𝗍𝖺 𝗐𝖺𝗅𝗅𝗉𝖺𝗉𝖾𝗋 𝗈𝗋 𝖯𝖯 𝖶𝖠,𝗄𝖾𝗉𝗈 𝗄𝗇 𝗆𝖾𝗇𝗎 𝗅𝖺𝗂𝗇𝗇𝗒𝖺?𝗇𝗁 𝗃𝗈𝗂𝗇 𝗌𝗂𝗇𝗂 𝖼𝖺𝗋𝖺𝗇𝗒𝖺 𝖼𝗎𝗄𝗎𝗉 𝗍𝖺𝗉 𝗅𝗂𝗇𝗄 𝖽𝗂 𝖻𝗐𝗁 𝗂𝗇𝗂:↓

『🦹🏻‍♀️𝗅𝗂𝗇𝗄 𝖺𝗄𝗌𝖺𝗋𝖺 𝗅𝖺𝗎𝗍!?:
https://chat.whatsapp.com/BwCJilgOguGAGxnkUdZg21

｡ﾟﾟ･｡･ﾟﾟ｡
ﾟ𝗗𝗢𝗡'𝗧 𝗡𝗜𝗥𝗨 𝗟𝗜𝗦𝗧 𝗜𝗡𝗜?𝗡𝗜𝗥𝗨?,
　ﾟ･｡･ﾟ𝗦𝗜𝗔𝗣² 𝗝𝗗𝗜 𝗔𝗥𝗧𝗜𝗦 𝗗𝗔𝗗𝗔𝗞𝗔𝗡.
[24/5 16.04] +62 895-3247-50151: *GC Nimbrung*
https://chat.whatsapp.com/KPvNWjWeKfrLCnyWQgV9Y9
Bkn gc sherlink msh maksa d kick sma bot jngn slh gue dn emote batu selalu d hati 🗿🗿🗿🗿🗿🗿🗿🗿🗿

*GC Sharelink 1*
https://chat.whatsapp.com/HvvZRtS0r5o8R2uYEkVxfN
Nih y tod klo mau sherlink 🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿

*GC Sharelink 2*
https://chat.whatsapp.com/J5HJb6UKX391eZlPGOlCAQ
Sher pke ht biasany jamet🗿🗿🗿🗿🗿

___________________________________________

Mau pacaran tkt dosa? Tmn d chat g respon kek kntl? Cobain nih Fitur ChatGPT. Mau curhat, gibah, galau, nyari jawaban mtk, Ipa, langit ke 8, cara g msk neraka dan dosa jadi saldo dana... 🗿🗿🗿

Ksh aj prtnyaan dan dia juga jwb
G asik? Msh mnding d respon dripda tmn lu yg d chat tpi g respon
*Wa.me/6289509103806*
Plus Kalo eror slh lu 🗿🗿🗿🗿

D baca dulu yg lengkap y tod jngn maen asal masuk, yg g baca matany ilang sblh🗿🗿

*Linktree milik Owner (Wolf)*
https://linktr.ee/the_wolf301
\`\`\`TikTok ada disini ↑\`\`\`
Ktany si 🗿🗿🗿
[24/5 16.07] +62 859-3652-5985: ඞ𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌🚔🚨,αllօա everyone do you need a collection of sad words or sea words? or need a social media post? Well, it just so happens that here is a random group post called *@aksara laut*,𝖼𝗈𝗇𝗍𝗈𝗁 𝗆𝖾𝗇𝗎 𝗌𝖾𝗉𝖾𝗋𝗍𝗂,𝗊𝗎𝗈𝗍𝖾𝗌 𝗆𝗈𝗍𝗂𝗏𝖺𝗌𝗂 𝗁𝖽𝗉 𝗈𝗋 𝗀𝖺𝗅𝖺𝗎,𝗈𝗋 𝗅𝗈𝗇𝗀 𝗍𝖾𝗑𝗌 𝖻𝗎𝖺𝗍 𝗌𝖾𝗌𝖾𝗈𝗋𝗀,𝗈𝗋 𝖻𝖺𝗁𝖺𝗇 𝗌𝗐 𝖻𝗎𝖺𝗍 𝗌𝗐 𝗄𝗆𝗎,𝗈𝗋 𝖿𝗈𝗍𝗈² 𝗅𝖺𝗎𝗍 𝖻𝖾𝗌𝖾𝗋𝗍𝖺 𝗐𝖺𝗅𝗅𝗉𝖺𝗉𝖾𝗋 𝗈𝗋 𝖯𝖯 𝖶𝖠,𝗄𝖾𝗉𝗈 𝗄𝗇 𝗆𝖾𝗇𝗎 𝗅𝖺𝗂𝗇𝗇𝗒𝖺?𝗇𝗁 𝗃𝗈𝗂𝗇 𝗌𝗂𝗇𝗂 𝖼𝖺𝗋𝖺𝗇𝗒𝖺 𝖼𝗎𝗄𝗎𝗉 𝗍𝖺𝗉 𝗅𝗂𝗇𝗄 𝖽𝗂 𝖻𝗐𝗁 𝗂𝗇𝗂:↓

『🦹🏻‍♀️𝗅𝗂𝗇𝗄 𝖺𝗄𝗌𝖺𝗋𝖺 𝗅𝖺𝗎𝗍!?:
https://chat.whatsapp.com/BwCJilgOguGAGxnkUdZg21

｡ﾟﾟ･｡･ﾟﾟ｡
ﾟ𝗗𝗢𝗡'𝗧 𝗡𝗜𝗥𝗨 𝗟𝗜𝗦𝗧 𝗜𝗡𝗜?𝗡𝗜𝗥𝗨?,
　ﾟ･｡･ﾟ𝗦𝗜𝗔𝗣² 𝗝𝗗𝗜 𝗔𝗥𝗧𝗜𝗦 𝗗𝗔𝗗𝗔𝗞𝗔𝗡.
[24/5 16.08] +62 821-7344-3977: https://chat.whatsapp.com/DKyeiZ74hVhLQCvNggdZHV.   Join bantu rameinn
[24/5 16.09] +62 895-2037-0660: https://chat.whatsapp.com/LYxIkzwwz17Ag06guo9ydx

https://chat.whatsapp.com/LYxIkzwwz17Ag06guo9ydx

https://chat.whatsapp.com/LYxIkzwwz17Ag06guo9ydx

https://chat.whatsapp.com/LYxIkzwwz17Ag06guo9ydx

*JOIN SNI BEB💋*
[24/5 16.17] +62 882-3947-0237: │➤WELCOME MEMBERS
│════════════════
│⪩⪨ *GC RANDOM* ⪩⪨
│
*𝑮𝒓𝒖𝒃 𝒄𝒂𝒓𝒊 𝒅𝒐𝒊 𝟏*
https://chat.whatsapp.com/FYc6FaaDlMODXWPxagGRdj
*𝑮𝒓𝒖𝒃 𝒄𝒂𝒓𝒊 𝒅𝒐𝒊 𝟐*
https://chat.whatsapp.com/GKTSR7jkty4JL6Ajyf2FCc
*𝑮𝒓𝒖𝒃 𝒗𝒊𝒓𝒕𝒖𝒂𝒍 𝒗𝒊𝒃𝒆𝒔*
https://chat.whatsapp.com/DKyeiZ74hVhLQCvNggdZHV
*𝑮𝒓𝒖𝒃 𝒔𝒉𝒂𝒓𝒆 𝒍𝒊𝒏𝒌*
https://chat.whatsapp.com/GOORL7n3Zng7rXebPMspiv
│════════════════
✄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┍━━━━━»•» 🌺 «•«━┑
          𝐖𝐀𝐑𝐍𝐈𝐍𝐆
┕━»•» 🌺 «•«━━━━━┙
✎ 𝑺𝒆𝒃𝒆𝒍𝒖𝒎 𝒎𝒂𝒔𝒖𝒌 𝒃𝒂𝒄𝒂 𝒅𝒆𝒔𝒌𝒓𝒊𝒑𝒔𝒊 𝒚𝒂
✎ 𝑩𝒂𝒏𝒕𝒖 𝒔𝒉𝒂𝒓𝒆 𝒂𝒕𝒂𝒖 𝒔𝒘 𝒊𝒏
[24/5 16.39] +62 812-4242-0386: *╭࣭࣭࣭࣭࣭࣭ٜ۫╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬💋⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬💋✿᳞〫۫࣪◌๋᳝☬≽╼╮*
*https://chat.whatsapp.com/LF8ZogkNEbQJMPva1MRFbj*
*╰╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬📍⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬📍✿᳞〫۫࣪◌๋᳝☬≽╼╯*

LoLi📍ch∆ns🍼 JOiN 💋
[24/5 16.44] +62 859-3652-5985: ඞ𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌 𝐁𝐑𝐔𝐌🚔🚨,αllօա everyone do you need a collection of sad words or sea words? or need a social media post? Well, it just so happens that here is a random group post called *@aksara laut*,𝖼𝗈𝗇𝗍𝗈𝗁 𝗆𝖾𝗇𝗎 𝗌𝖾𝗉𝖾𝗋𝗍𝗂,𝗊𝗎𝗈𝗍𝖾𝗌 𝗆𝗈𝗍𝗂𝗏𝖺𝗌𝗂 𝗁𝖽𝗉 𝗈𝗋 𝗀𝖺𝗅𝖺𝗎,𝗈𝗋 𝗅𝗈𝗇𝗀 𝗍𝖾𝗑𝗌 𝖻𝗎𝖺𝗍 𝗌𝖾𝗌𝖾𝗈𝗋𝗀,𝗈𝗋 𝖻𝖺𝗁𝖺𝗇 𝗌𝗐 𝖻𝗎𝖺𝗍 𝗌𝗐 𝗄𝗆𝗎,𝗈𝗋 𝖿𝗈𝗍𝗈² 𝗅𝖺𝗎𝗍 𝖻𝖾𝗌𝖾𝗋𝗍𝖺 𝗐𝖺𝗅𝗅𝗉𝖺𝗉𝖾𝗋 𝗈𝗋 𝖯𝖯 𝖶𝖠,𝗄𝖾𝗉𝗈 𝗄𝗇 𝗆𝖾𝗇𝗎 𝗅𝖺𝗂𝗇𝗇𝗒𝖺?𝗇𝗁 𝗃𝗈𝗂𝗇 𝗌𝗂𝗇𝗂 𝖼𝖺𝗋𝖺𝗇𝗒𝖺 𝖼𝗎𝗄𝗎𝗉 𝗍𝖺𝗉 𝗅𝗂𝗇𝗄 𝖽𝗂 𝖻𝗐𝗁 𝗂𝗇𝗂:↓

『🦹🏻‍♀️𝗅𝗂𝗇𝗄 𝖺𝗄𝗌𝖺𝗋𝖺 𝗅𝖺𝗎𝗍!?:
https://chat.whatsapp.com/BwCJilgOguGAGxnkUdZg21

｡ﾟﾟ･｡･ﾟﾟ｡
ﾟ𝗗𝗢𝗡'𝗧 𝗡𝗜𝗥𝗨 𝗟𝗜𝗦𝗧 𝗜𝗡𝗜?𝗡𝗜𝗥𝗨?,
　ﾟ･｡･ﾟ𝗦𝗜𝗔𝗣² 𝗝𝗗𝗜 𝗔𝗥𝗧𝗜𝗦 𝗗𝗔𝗗𝗔𝗞𝗔𝗡.
[24/5 22.25] +62 877-3526-3767: https://chat.whatsapp.com/HcReksyNmy0C0WmgGDTOA9
[24/5 22.33] +62 889-7542-76554: *Join gc kawan kinderjoy sinii💋nnti ketemu Kinderjoy si cindo cantik hahaha🤏🏻🐦asikin aja Joyy ga milih" temen💍*
https://chat.whatsapp.com/KUSjYzzjo0b7crqjjZbQlU
[24/5 22.39] أنا مثل زهرة ذابلة: *assalamualaikum min izin bagi link gc ya semuanya*

GC 1

https://chat.whatsapp.com/ES4dHJKuZQ66Vcn9Q7VamX

GC 2

https://chat.whatsapp.com/K3uXSj4Ktpv2v0IgpumJnC

GC 3

https://chat.whatsapp.com/GWFZNiKroATDwZ44gSw0D4

GC 4 

https://chat.whatsapp.com/HOizmYiuRpIJm2h5J3z1J6
*bantu ramein ygy 🙏🏻*
*bukan gc bkp tod*
*izin min.jangan mandang member ygy entar penuh sendiri.bck aja kok gpp*
*gak masuk gc ini hamil ama jadi perawan tua and perjaka tua🐔*
[24/5 22.44] +62 812-4242-0386: *╭࣭࣭࣭࣭࣭࣭ٜ۫╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🇲🇨⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬🇲🇨✿᳞〫۫࣪◌๋᳝☬≽╼╮*
*https://chat.whatsapp.com/LF8ZogkNEbQJMPva1MRFbj*
*╰╾≼☬☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🇲🇨⃘۪֟፝֯۫۫۫⬪⃘̸⃘𐇽᳝۫۫۫۫۫۬፝֯֟᷼⃝۫۫۫۫۫۬◌̷๋᳞࣪࣪࣪۬🇲🇨✿᳞〫۫࣪◌๋᳝☬≽╼╯*

LoLi📍`));
console.log(require('corewapi-next'));
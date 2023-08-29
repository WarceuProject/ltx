const WebP = require('node-webpmux')
let img = new WebP.Image()
const si = require("systeminformation");


exports.Exif = async function Exif(input, name, publisher) {
	const pack = {
		"sticker-pack-id":"com.marsvard.stickermakerforwhatsapp.stickercontentprovider 1594741845",
		// "sticker-pack-name": name ? name : 'XIENA - XUUZEN', //"LOVE U SAYANG ❤️\n\n\n\n\n\nFROM XIENA AUTHOR",
		//"sticker-pack-publisher":"@dandisubhani_",
		"android-app-store-link":"https://play.google.com/store/apps/details/WhatsApp_Messenger?id=com.whatsapp",
		"categories": ['']
		//"ios-app-store-link":"https://itunes.apple.com/app/sticker-maker-studio/id1443326857"
	}
	const osInfo = await si.osInfo();
	
	if (name !== void 0) {
		if (name === "") {
			name = " ";
		}
	} else {
		name = `
┏⬣ Date: ${new Date().toLocaleString('id')}
┃⬣ Author: LINTX PRO
┃⬣ Engine: VPS KVM warceuproject.dev
┗⬣ OS: ${osInfo.distro} ${osInfo.release} ${osInfo.codename}
`.trim()
	}
	if (publisher !== void 0) {
		if (publisher === "") {
			publisher = " ";
		}
	}
	
	pack["sticker-pack-name"] = name;
	pack["sticker-pack-publisher"] = publisher;
	
	if (publisher === void 0) {
		delete pack["sticker-pack-publisher"];
	}
	
	console.log('\x1b[32m%s\x1b[0m \x1b[1;30m-\x1b[0m \x1b[34m%s\x1b[0m', name, publisher);
	
	await img.load(input)
	let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]),
      jsonBuffer = Buffer.from(JSON.stringify(pack), 'utf8'),
      exif = Buffer.concat([exifAttr, jsonBuffer])

  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  img.exif = exif
	await img.save()
}
exports.image2Sticker = function image2Sticker(input, output) {
	return new Promise((resolve, reject) => {
		const { spawn } = require('child_process')
		const ffmpeg = spawn('ffmpeg', ['-y', '-i', input, '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1', '-f', 'webp', output])
		
		ffmpeg.on('error', err => {
			reject(err)
			console.log(`ffmpeg: ${err}`)
		})
		ffmpeg.stdout.on('data', data => {
			console.log(`ffmpeg: stdout:\n${data}`)
		})
		ffmpeg.stderr.on('data', err => {
			console.log(`ffmpeg: stderr:\n${err}`)
		})
		ffmpeg.on('close', code => {
			resolve({
				input,
				output
			})
			console.log('ffmpeg: exit with code %d', code)
		})
	})
}
function ffmpeg(...args) {
	const { spawnSync, execSync } = require('child_process')
	const then = resolve => {
		const res = new function ffmpeg() {}
		const aud = "/storage/emulated/0/Download/y2mate.com_-_Lugowo_lagu_China_versi_Dangdut_Sibay_Classic.mp3"
		const png = "/storage/emulated/0/Download/images (5) (5).jpeg"
		const {
			stdout,
			stderr
		} = spawnSync('ffmpeg', args)
		
		if (!stdout?.length || stderr?.length) {
			const data = Buffer.from(stderr, 'utf8').toString()
			const message = data?.split?.('libpostproc    56.  3.100 / 56.  3.100')[1].trim?.() || null
			
			console.log('\x1b[31mffmpeg: \x1b[0m%s', message)
			res.data = {
				stderr: data,
				message
			}
			resolve(res)
			
			return
		}
		
		res.data = {
			stdout: Buffer.from(stdout, 'utf8').toString()
		}
		
		resolve(res)
	}
	
	return { then }
}
async function checkIfInstalled(module_name) {
	return new Promise(async resolve => {
		resolve(
			await import(module_name)
				.catch(e => {
				console.error({
					error: { 
						message: e.message || null,
						...e
					}
				})
				
				return null
			})
		)
	})
}
void async function() {
	// const res = (await ffmpeg('-i', '/sdcard/nix.webp', '/sdcard/nix.jpeg')).data
	// "/storage/emulated/0/Download/Cash Cash - Hero (Lyrics) feat. Christina Perri.mp3", "-metadata", "title=xuuzen - xiena", "-metadata", "album=export", "-c:a", "libmp3lame", "/sdcard/output.mp3"
	//`ffmpeg -y -i "${aud}" -i "${png}" -c copy -map 0 -map 1 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (Front)" -c:a libmp3lame /sdcard/project/output.mp3`
	
	// console.log(res)
	const mod = await checkIfInstalled('url')
	
	if (!mod)
		return
	
	// console.log(mod)
}()

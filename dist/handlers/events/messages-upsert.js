"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const systeminformation_1 = __importDefault(require("systeminformation"));
async function default_1(ltx, context) {
    const { messages: [m] } = context.getInfo();
    const id = m.key.remoteJid;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
    console.log(JSON.stringify(m, null, 2));
    if (text === 'bot') {
        await ltx.sendMessage(m.key.remoteJid, { text: JSON.stringify({ message: text, timestamp: +new Date }, null, 2) }, { quoted: m });
    }
    switch (text) {
        case 'uptime':
            const d = normalizeUptime();
            await ltx.sendMessage(id, { text: `*[SERVER-PROCTIME]*\n\nOnline selama: *${d.weeks} minggu*, *${d.days} hari*, *${d.hours} jam*, *${d.minutes} menit*, *${d.seconds} detik*, *${d.milliseconds} milidetik*\n\n*_run with @lintang-ai & v8 engine_*` }, { quoted: m });
            break;
        case 'info':
            const { cpu, osInfo, system, time, mem } = await systemInformation();
            const wrapItem = (o) => Object.keys(o).map((k) => `${k}: *${o[k] || '-'}*`).join('\n');
            await ltx.sendMessage(id, { text: `*[SERVER-INFORMATION]*\n\n*Creator*\nName: *@lintanx, xuuzen, maiki, haxen*\n\n*CPU*\n${wrapItem(cpu)}\n\n*OS*\n${wrapItem(osInfo)}\n\n*System*\n${wrapItem(system)}\n\n*Time*\n${wrapItem(time)}\n\n*Memory*\n${wrapItem(mem)}\n\n*_run with @lintang-ai & v8 engine_*` }, { quoted: m });
            break;
        default:
            break;
    }
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

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _OpenWASocket_waSocket;
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const core_wapi_1 = __importStar(require("core-wapi"));
const logger_1 = require("./logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger = (0, logger_1.createInterface)().instance();
const sockLogger = (0, logger_1.createInterface)().instance();
const msgRetryCounterCache = new node_cache_1.default();
const sockConfigKey = Symbol('socketConfig');
const fileAuthStateKey = Symbol('fileAuthState');
class OpenWASocket {
    constructor(sockConfig) {
        _OpenWASocket_waSocket.set(this, void 0);
        /** set default sockLogger level */
        if (!sockConfig || sockConfig?.silent) {
            sockLogger.level = 'silent';
        }
        const defaultSockConfig = {
            logger: sockLogger,
            browser: ['LINTX V2 Mod @aldi [unstable]', 'Desktop', '3.0'],
            msgRetryCounterCache,
            generateHighQualityLinkPreview: true,
            printQRInTerminal: true,
            auth: undefined,
            useDefaultConfig: !sockConfig,
            syncFullHistory: false
        };
        /** socket config */
        this[sockConfigKey] = sockConfig || defaultSockConfig;
        /** check for using default config */
        this.useDefaultConfig = defaultSockConfig.useDefaultConfig;
    }
    async connect(opts) {
        const defaultSessionName = 'default';
        const sessionName = opts?.session_name || defaultSessionName;
        const counter = opts?.counter;
        const { state, saveCreds } = await (0, core_wapi_1.useMultiFileAuthState)(sessionName);
        const { version, isLatest } = await (0, core_wapi_1.fetchLatestBaileysVersion)();
        const auth = {
            creds: state.creds,
            keys: (0, core_wapi_1.makeCacheableSignalKeyStore)(state.keys, sockLogger),
        };
        const sockConfig_ = this[sockConfigKey];
        const patchMessageBeforeSending = (message) => {
            return message;
        };
        /** count reconnect */
        if (counter) {
            if (!global.connectCounter) {
                counter.init();
            }
            counter.count();
        }
        /** set default socket config */
        if (this.useDefaultConfig) {
            this[sockConfigKey] = {
                ...sockConfig_,
                version,
                auth,
                patchMessageBeforeSending
            };
        }
        /** prevent logging more than once */
        if (!global.reconnect) {
            console.log('\x1b[90musing %sWA \x1b[0m\x1b[92mv%s\x1b[0m', isLatest ? 'latest ' : '', version.join('.'));
            console.log('\x1b[96mopen connection to whatsapp web\x1b[0m\n');
        }
        /** set fileAuthState */
        this[fileAuthStateKey] = {
            state,
            saveCreds
        };
        const this_ = this;
        const sockConfig = this[sockConfigKey];
        const thenable = {
            then(resolve) {
                const waSocket = (0, core_wapi_1.default)(sockConfig);
                /** set sessionName */
                waSocket.sessionName = sessionName;
                /** set authUpdate */
                waSocket.authUpdate = {
                    /** update connection */
                    connection: (cb) => waSocket.ev.on('connection.update', cb),
                    /** update creds */
                    creds: async () => waSocket.ev.on('creds.update', await saveCreds)
                };
                __classPrivateFieldSet(this_, _OpenWASocket_waSocket, waSocket, "f");
                resolve(waSocket);
            }
        };
        return thenable;
    }
    logout() {
        const waSocket_ = __classPrivateFieldGet(this, _OpenWASocket_waSocket, "f");
        logger.info('closed the connection to the whatsapp web');
        try {
            let sessionNameCache = false;
            /** check connection established */
            if (waSocket_.user) {
                /** logout from whatsapp web */
                waSocket_.logout().catch((e) => {
                    if (e) {
                        logger.error(e);
                    }
                });
                logger.info('successfully disconnected to whatsapp web');
                logger.warn('action can\'t be undone, you will be asked to scan a qr code to reconnect to whatsapp web');
            }
            else {
                logger.error('nothing for closed the connection has not been established');
                sessionNameCache = true;
            }
            /** remove session */
            this.removeSession(waSocket_.sessionName, sessionNameCache);
            process.exit(1);
        }
        catch (e) {
            logger.error(e);
        }
    }
    kill() {
        logger.warn('connection to whatsapp web server was successfully terminated');
        process.exit(1);
    }
    removeSession(sessName, cache) {
        const sessNamePath = path_1.default.join(process.cwd(), sessName);
        const sessName_ = path_1.default.basename(sessNamePath);
        try {
            fs_1.default.rmdirSync(sessNamePath);
            if (!cache) {
                logger.info("session '%s' successfully removed", sessName_);
            }
        }
        catch (e) {
            logger.error(e);
        }
    }
    getConfig() {
        return this[sockConfigKey];
    }
    getFileAuthState() {
        return this[fileAuthStateKey];
    }
}
exports.default = OpenWASocket;
_OpenWASocket_waSocket = new WeakMap();

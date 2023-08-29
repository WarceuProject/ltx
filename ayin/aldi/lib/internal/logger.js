"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerChild = exports.logger = exports.createMiddleware = exports.createInterface = void 0;
const pino_1 = __importDefault(require("pino"));
function createInterface(opts) {
    const opts_ = Object.assign({}, opts || {});
    delete opts_.pretty;
    let loggerOptions = opts_;
    const isOptions = '0' in arguments;
    const isPretty = ('pretty' in (opts || {}));
    const prettyOptions = opts?.pretty;
    const defaultOptions = {
        transport: {
            target: 'pino-pretty',
            options: {
                levelFirst: true,
                ignore: 'hostname,pid',
                translateTime: 'SYS:hh:mm:ss.l TT'
            }
        }
    };
    const options = {
        transport: {
            target: defaultOptions.transport.target,
            options: isPretty ? prettyOptions : defaultOptions.transport.options
        },
        ...loggerOptions
    };
    loggerOptions = isOptions ? options : defaultOptions;
    if (isPretty && opts?.pretty === false) {
        delete loggerOptions.transport;
    }
    const logger = (0, pino_1.default)(loggerOptions);
    return {
        instance() {
            return logger;
        },
        resolveOptions() {
            return {
                default: !isOptions,
                ...options
            };
        },
        child(child) {
            return {
                instance() {
                    return logger.child(child ? child : { type: 'default' });
                }
            };
        }
    };
}
exports.createInterface = createInterface;
function createMiddleware(opts) {
    instance.type = 'logger';
    return instance;
    function instance() {
        return createInterface(opts || {}).instance();
    }
}
exports.createMiddleware = createMiddleware;
exports.logger = createInterface().instance();
exports.loggerChild = createInterface().child;
exports.default = createInterface;

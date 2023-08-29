"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbacksFactory = exports.cbFnFiles = exports.files = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../constants");
exports.files = fs_1.default.readdirSync(__dirname)
    .filter((file) => !/^index\.((c|m)?js)/g.test(file));
exports.cbFnFiles = exports.files.map((file) => {
    try {
        const fullPath = path_1.default.join(__dirname, file);
        const cbFn = require(fullPath)?.default;
        if (typeof cbFn !== 'function') {
            throw TypeError('callback must be a function at \'' + file + '\'');
        }
        else {
            if (!cbFn.type) {
                throw ReferenceError('undefined type at callback function \'' + file + '\'');
            }
        }
        return cbFn;
    }
    catch (e) {
        throw e;
    }
});
const callbacksFactory = (...args) => exports.cbFnFiles.reduce((factory, fn) => ({ ...factory, [constants_1.BaileysEvent[fn.type]]: fn.bind(...args) }), {});
exports.callbacksFactory = callbacksFactory;
exports.default = exports.callbacksFactory;

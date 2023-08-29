"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbacksFactory = exports.cbFnFactory = exports.cbFnMap = exports.cbFn = exports.files = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** exclude index */
exports.files = fs_1.default.readdirSync(__dirname).filter((file) => !/^index\..+$/g.test(file));
/** resolve files */
exports.cbFn = exports.files.map((file) => require(path_1.default.join(__dirname, file)));
/** mapped to default */
exports.cbFnMap = exports.cbFn.map((o) => o?.default);
/** callback function factory */
exports.cbFnFactory = exports.cbFnMap.reduce((o, fn) => ({ ...o, [fn.type]: fn }), {});
const callbacksFactory = (context) => exports.cbFnMap.reduce((o, fn) => ({ ...o, [fn.type]: fn(fn.type) }), {});
exports.callbacksFactory = callbacksFactory;
exports.default = exports.callbacksFactory;

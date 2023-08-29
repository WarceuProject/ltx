"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("./events"));
const callbacksFactory = (0, events_1.default)({});
for (const key in callbacksFactory) {
    callbacksFactory[key]();
}

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = __importStar(require("./lib/internal/connect"));
const socket_1 = __importDefault(require("./lib/internal/socket"));
const handlers_1 = __importDefault(require("./handlers"));
require("./constants/events");
global.LintxStart = async function () {
    const waSocketOptions = {
        counter: connect_1.ConnectServerCounter,
        session_name: 'session-name'
    };
    const openWASocket = new socket_1.default();
    const waSocket = await openWASocket.connect(waSocketOptions);
    const server = connect_1.default.createConnection();
    // server.use(messageTransform())
    server.useSocket(waSocket);
    server.bindEvents(handlers_1.default);
};
LintxStart();

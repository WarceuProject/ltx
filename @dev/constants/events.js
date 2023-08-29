"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaileysEvent = void 0;
/**
 * BaileysEvent map
 * connection = 1
 * creds = 2
 * messaging-history = 3
 * chats = 4
 * presence = 5
 * contacts = 6
 * messages = 7
 * message-receipt = 8
 * groups = 9
 * group-participants = 10
 * blocklist = 11
 * call = 12
 * SubBaileysEvent
 * update = 0
 * set = 1
 * upsert = 2
 * delete = 3
 * media-update = 4
 * reaction = 5
 * v2 sub
 * v2 = 0
 */
var BaileysEvent;
(function (BaileysEvent) {
    BaileysEvent[BaileysEvent["connection.update"] = 10] = "connection.update";
    BaileysEvent[BaileysEvent["creds.update"] = 20] = "creds.update";
    BaileysEvent[BaileysEvent["messaging-history.set"] = 31] = "messaging-history.set";
    BaileysEvent[BaileysEvent["chats.upsert"] = 42] = "chats.upsert";
    BaileysEvent[BaileysEvent["chats.update"] = 40] = "chats.update";
    BaileysEvent[BaileysEvent["chats.delete"] = 43] = "chats.delete";
    BaileysEvent[BaileysEvent["presence.update"] = 50] = "presence.update";
    BaileysEvent[BaileysEvent["contacts.upsert"] = 62] = "contacts.upsert";
    BaileysEvent[BaileysEvent["contacts.update"] = 60] = "contacts.update";
    BaileysEvent[BaileysEvent["messages.delete"] = 73] = "messages.delete";
    BaileysEvent[BaileysEvent["messages.update"] = 70] = "messages.update";
    BaileysEvent[BaileysEvent["messages.media-update"] = 74] = "messages.media-update";
    BaileysEvent[BaileysEvent["messages.upsert"] = 72] = "messages.upsert";
    BaileysEvent[BaileysEvent["messages.upsert-v2"] = 720] = "messages.upsert-v2";
    BaileysEvent[BaileysEvent["messages.reaction"] = 75] = "messages.reaction";
    BaileysEvent[BaileysEvent["message-receipt.update"] = 80] = "message-receipt.update";
    BaileysEvent[BaileysEvent["groups.upsert"] = 92] = "groups.upsert";
    BaileysEvent[BaileysEvent["groups.update"] = 90] = "groups.update";
    BaileysEvent[BaileysEvent["group-participants.update"] = 100] = "group-participants.update";
    BaileysEvent[BaileysEvent["group-participants.update-v2"] = 1000] = "group-participants.update-v2";
    BaileysEvent[BaileysEvent["blocklist.set"] = 111] = "blocklist.set";
    BaileysEvent[BaileysEvent["blocklist.update"] = 110] = "blocklist.update";
    BaileysEvent[BaileysEvent["call"] = 12] = "call";
})(BaileysEvent = exports.BaileysEvent || (exports.BaileysEvent = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
function EventsAll() {
    return (0, events_1.callbacksFactory)(this, this);
}
exports.default = EventsAll;

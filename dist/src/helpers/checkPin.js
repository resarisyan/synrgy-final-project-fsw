"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPin = checkPin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function checkPin(encryptedPin, pin) {
    try {
        const result = await bcryptjs_1.default.compare(pin, encryptedPin);
        return result;
    }
    catch (e) {
        return e;
    }
}
//# sourceMappingURL=checkPin.js.map
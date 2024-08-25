"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChecksum = generateChecksum;
const checksum_1 = __importDefault(require("checksum"));
async function generateChecksum(data) {
    const hash = (0, checksum_1.default)(data).toUpperCase();
    return hash.substring(0, 4);
}
//# sourceMappingURL=generateChecksum.js.map
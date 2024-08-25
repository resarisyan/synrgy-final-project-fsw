"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encryptData = (data, key) => {
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, process.env.QR_IV_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
exports.encryptData = encryptData;
const decryptData = (data, key) => {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, process.env.QR_IV_KEY);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptData = decryptData;
//# sourceMappingURL=encryption.js.map
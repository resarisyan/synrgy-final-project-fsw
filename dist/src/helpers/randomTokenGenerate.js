"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomTokenGenerate = void 0;
const characters = '0123456789';
const randomTokenGenerate = () => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.randomTokenGenerate = randomTokenGenerate;
//# sourceMappingURL=randomTokenGenerate.js.map
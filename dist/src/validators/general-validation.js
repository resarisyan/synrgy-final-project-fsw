"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralValidation = void 0;
const zod_1 = require("zod");
class GeneralValidation {
}
exports.GeneralValidation = GeneralValidation;
GeneralValidation.PHONE = zod_1.z.object({
    phone: zod_1.z
        .string()
        .min(10, { message: 'Phone number must be at least 10 digits long' })
        .max(15, { message: 'Phone number must be at most 15 digits long' })
        .regex(/^\d+$/, { message: 'Phone number must only contain digits' })
});
GeneralValidation.PIN = zod_1.z.object({
    pin: zod_1.z
        .string()
        .length(6, { message: 'PIN must be exactly 6 digits long' })
        .regex(/^\d+$/, { message: 'PIN must only contain digits' })
});
//# sourceMappingURL=general-validation.js.map
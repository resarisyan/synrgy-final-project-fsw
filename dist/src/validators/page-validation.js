"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageValidation = void 0;
const zod_1 = require("zod");
class PageValidation {
}
exports.PageValidation = PageValidation;
PageValidation.PAGE = zod_1.z.object({
    page: zod_1.z.number().int().min(0),
    size: zod_1.z.number().int().min(0)
});
//# sourceMappingURL=page-validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const zod_1 = require("zod");
const objection_1 = require("objection");
const response_error_js_1 = require("../../handlers/response-error.js");
const errorResponse = ({ error, res }) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: error.errors[0]?.message
        });
    }
    else if (error instanceof objection_1.NotFoundError) {
        res.status(404).json({
            success: false,
            message: 'Not found'
        });
    }
    else if (error instanceof response_error_js_1.ResponseError) {
        res.status(error.status).json({
            success: false,
            message: error.message
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=error-response.js.map
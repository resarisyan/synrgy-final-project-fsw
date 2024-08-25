"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPinMiddleware = void 0;
const UserModel_1 = require("../models/UserModel"); // Sesuaikan dengan model user yang Anda gunakan
const response_error_1 = require("../handlers/response-error");
const error_response_1 = require("../dtos/response/error-response");
const checkPin_1 = require("../helpers/checkPin");
const validators_1 = require("../validators");
const general_validation_1 = require("../validators/general-validation");
const checkPinMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const request = validators_1.Validation.validate(general_validation_1.GeneralValidation.PIN, req.body);
        const pin = request.pin;
        if (!userId) {
            throw new response_error_1.ResponseError(400, 'User ID and PIN are required');
        }
        const user = await UserModel_1.UserModel.query().findById(userId);
        if (!user) {
            throw new response_error_1.ResponseError(401, 'User not found');
        }
        const userPin = user.pin;
        const pinValidation = await (0, checkPin_1.checkPin)(userPin, pin);
        if (!pinValidation) {
            throw new response_error_1.ResponseError(401, 'Invalid PIN');
        }
    }
    catch (err) {
        return (0, error_response_1.errorResponse)({ error: err, res });
    }
    return next();
};
exports.checkPinMiddleware = checkPinMiddleware;
//# sourceMappingURL=check-pin-middleware.js.map
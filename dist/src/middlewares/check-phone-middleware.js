"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPhoneMiddleware = void 0;
const UserModel_1 = require("../models/UserModel"); // Sesuaikan dengan model user yang Anda gunakan
const response_error_1 = require("../handlers/response-error");
const error_response_1 = require("../dtos/response/error-response");
const validators_1 = require("../validators");
const general_validation_1 = require("../validators/general-validation");
const checkPhoneMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const request = validators_1.Validation.validate(general_validation_1.GeneralValidation.PHONE, req.body);
        const phone = request.phone;
        const user = await UserModel_1.UserModel.query().findById(userId);
        if (!user) {
            throw new response_error_1.ResponseError(401, 'User not found');
        }
        const userPhone = user.phone;
        const phoneValidation = phone === userPhone;
        if (!phoneValidation) {
            throw new response_error_1.ResponseError(401, 'Invalid Phone');
        }
    }
    catch (err) {
        return (0, error_response_1.errorResponse)({ error: err, res });
    }
    return next();
};
exports.checkPhoneMiddleware = checkPhoneMiddleware;
//# sourceMappingURL=check-phone-middleware.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const response_error_1 = require("../handlers/response-error");
const dotenv_1 = __importDefault(require("dotenv"));
const UserModel_1 = require("../models/UserModel");
const error_response_1 = require("../dtos/response/error-response");
dotenv_1.default.config();
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new response_error_1.ResponseError(401, 'Token not found');
        }
        const jwtToken = authHeader.split(' ')[1];
        const response = await fetch(`${process.env.BE_JAVA_URL}/account/detail`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
        const statusCode = response.status;
        if (statusCode !== 200) {
            throw new response_error_1.ResponseError(statusCode, 'Token not valid');
        }
        const res = (await response.json());
        const user = await UserModel_1.UserModel.query().findById(res.data.user_id);
        req.user = user;
    }
    catch (err) {
        return (0, error_response_1.errorResponse)({ error: err, res });
    }
    return next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map
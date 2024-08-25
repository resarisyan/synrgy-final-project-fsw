"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const objection_1 = require("objection");
const UserModel_1 = require("./UserModel");
class OtpModel extends objection_1.Model {
}
exports.OtpModel = OtpModel;
OtpModel.tableName = 'otps';
OtpModel.relationMappings = {
    user: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: UserModel_1.UserModel,
        join: {
            from: 'otp.user_id',
            to: 'users.id'
        }
    }
};
//# sourceMappingURL=OtpModel.js.map
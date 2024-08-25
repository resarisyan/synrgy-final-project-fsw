"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrisModel = void 0;
const objection_1 = require("objection");
const UserModel_1 = require("./UserModel");
class QrisModel extends objection_1.Model {
}
exports.QrisModel = QrisModel;
QrisModel.tableName = 'qris';
QrisModel.relationMappings = {
    user: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: UserModel_1.UserModel,
        join: {
            from: 'qris.user_id',
            to: 'users.id'
        }
    }
};
//# sourceMappingURL=QrisModel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationModel = void 0;
const objection_1 = require("objection");
const UserModel_1 = require("./UserModel");
class MutationModel extends objection_1.Model {
}
exports.MutationModel = MutationModel;
MutationModel.tableName = 'mutations';
MutationModel.relationMappings = () => ({
    user: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: UserModel_1.UserModel,
        join: {
            from: 'mutations.user_id',
            to: 'users.id'
        }
    },
    account: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: UserModel_1.UserModel,
        join: {
            from: 'mutations.account_number',
            to: 'users.account_number'
        }
    }
});
//# sourceMappingURL=MutationModel.js.map
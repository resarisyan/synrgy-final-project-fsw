"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const objection_1 = require("objection");
const CashTransactionModel_1 = require("./CashTransactionModel");
const MutationModel_1 = require("./MutationModel");
class UserModel extends objection_1.Model {
}
exports.UserModel = UserModel;
UserModel.tableName = 'users';
UserModel.relationMappings = {
    mutations: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: MutationModel_1.MutationModel,
        join: {
            from: 'users.id',
            to: 'mutations.user_id'
        }
    },
    cash_transactions: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: CashTransactionModel_1.CashTransactionModel,
        join: {
            from: 'users.id',
            to: 'cash_transactions.user_id'
        }
    }
};
//# sourceMappingURL=UserModel.js.map
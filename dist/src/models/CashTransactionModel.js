"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransactionModel = void 0;
const objection_1 = require("objection");
const UserModel_1 = require("./UserModel");
class CashTransactionModel extends objection_1.Model {
}
exports.CashTransactionModel = CashTransactionModel;
CashTransactionModel.tableName = 'cash_transactions';
CashTransactionModel.relationMappings = {
    user: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: UserModel_1.UserModel,
        join: {
            from: 'cash_transactions.user_id',
            to: 'users.id'
        }
    }
};
//# sourceMappingURL=CashTransactionModel.js.map
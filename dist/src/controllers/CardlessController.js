"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardlessController = void 0;
const CashTransactionService_1 = require("../services/CashTransactionService");
const cash_transaction_enum_1 = require("../enums/cash-transaction-enum");
const error_response_1 = require("../dtos/response/error-response");
class CardlessController {
}
exports.CardlessController = CardlessController;
_a = CardlessController;
CardlessController.tokenGenerate = async (req, res) => {
    try {
        const request = req.body;
        request.user = req.user;
        const transaction = await CashTransactionService_1.CashTransactionService.create(request);
        res.json({
            success: true,
            message: 'Token Generated Successfully',
            data: transaction
        });
    }
    catch (error) {
        (0, error_response_1.errorResponse)({ error: error, res });
    }
};
CardlessController.demoWithdraw = async (req, res) => {
    try {
        const request = req.body;
        request.type = cash_transaction_enum_1.EnumCashTransaction.WITHDRAW;
        const transaction = await CashTransactionService_1.CashTransactionService.store(request, req.user.id);
        res.json({
            success: true,
            message: 'Withdraw Successfully',
            data: transaction
        });
    }
    catch (error) {
        (0, error_response_1.errorResponse)({ error: error, res });
    }
};
CardlessController.demoTopup = async (req, res) => {
    try {
        const request = req.body;
        request.type = cash_transaction_enum_1.EnumCashTransaction.TOPUP;
        const transaction = await CashTransactionService_1.CashTransactionService.store(request, req.user.id);
        res.json({
            success: true,
            message: 'Topup Successfully',
            data: transaction
        });
    }
    catch (error) {
        (0, error_response_1.errorResponse)({ error: error, res });
    }
};
CardlessController.tokenHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const request = req.body;
        request.user = req.user;
        if (startDate) {
            request.createdAtStart = new Date(startDate);
        }
        if (endDate) {
            request.createdAtEnd = new Date(endDate);
        }
        const transaction = await CashTransactionService_1.CashTransactionService.getAllTransactions(request);
        res.json({
            success: true,
            message: 'Cardless Transaction History Data Successfully Fetched',
            data: transaction
        });
    }
    catch (error) {
        (0, error_response_1.errorResponse)({ error: error, res });
    }
};
//# sourceMappingURL=CardlessController.js.map
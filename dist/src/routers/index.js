"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const transaction_router_1 = require("./transaction-router");
const mutation_router_1 = require("./mutation-router");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use('/transactions', transaction_router_1.transactionRouter);
exports.apiRouter.use('/mutations', mutation_router_1.mutationRouter);
//# sourceMappingURL=index.js.map
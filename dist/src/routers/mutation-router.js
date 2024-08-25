"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const MutationController_1 = require("../controllers/MutationController");
exports.mutationRouter = express_1.default.Router();
exports.mutationRouter.use(auth_middleware_1.authMiddleware);
exports.mutationRouter.get('/', MutationController_1.MutationController.getAll);
exports.mutationRouter.get('/estatement', MutationController_1.MutationController.generateEstatement);
exports.mutationRouter.get('/:id', MutationController_1.MutationController.getOne);
exports.mutationRouter.get('/:id/pdf', MutationController_1.MutationController.generatePdf);
//# sourceMappingURL=mutation-router.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const knex_1 = __importDefault(require("./config/knex"));
const knex_2 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = require("./routers");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const path_1 = __importDefault(require("path"));
objection_1.Model.knex((0, knex_2.default)(knex_1.default));
dotenv_1.default.config();
const port = process.env.PORT || 9999;
const app = (0, express_1.default)();
const publicPath = path_1.default.join(__dirname, '..', 'public');
app.use(express_1.default.static(publicPath));
app.locals.baseURL = `${process.env.BASE_URL}:${port}`;
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/v1', routers_1.apiRouter);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.listen(port, () => {
    console.log(`Server running on ${app.locals.baseURL}`);
});
//# sourceMappingURL=app.js.map
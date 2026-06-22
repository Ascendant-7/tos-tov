"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.default = async (req, res) => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    const instance = app.getHttpAdapter().getInstance();
    instance(req, res);
};
//# sourceMappingURL=index.js.map
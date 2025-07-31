"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        console.error('全局异常日志:', exception);
        throw exception;
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('博客 API')
        .setDescription('博客系统 API 文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`应用运行在: http://localhost:${port}`);
    console.log(`API 文档: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map
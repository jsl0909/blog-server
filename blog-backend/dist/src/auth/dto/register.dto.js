"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名', example: 'testuser' }),
    (0, class_validator_1.IsString)({ message: '用户名必须是字符串' }),
    (0, class_validator_1.MinLength)(3, { message: '用户名长度不能少于3个字符' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱', example: 'test@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: '请输入有效的邮箱地址' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '密码', example: 'password123', minLength: 6 }),
    (0, class_validator_1.IsString)({ message: '密码必须是字符串' }),
    (0, class_validator_1.MinLength)(6, { message: '密码长度不能少于6位' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '确认密码', example: 'password123' }),
    (0, class_validator_1.IsString)({ message: '确认密码必须是字符串' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '昵称', required: false, example: '测试用户' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '昵称必须是字符串' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '头像URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '头像URL必须是字符串' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "avatar", void 0);
//# sourceMappingURL=register.dto.js.map
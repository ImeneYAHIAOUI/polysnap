"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const messages_controller_1 = require("./controllers/messages.controller");
const chats_controller_1 = require("./controllers/chats.controller");
const messages_service_1 = require("./services/messages.service");
const chat_service_1 = require("./services/chat.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [messages_service_1.MessageService, chat_service_1.ChatService],
        controllers: [messages_controller_1.MessageController, chats_controller_1.ChatController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
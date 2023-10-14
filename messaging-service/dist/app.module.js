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
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const user_entity_1 = require("./entities/user.entity");
const user_proxy_service_1 = require("./services/user.proxy.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat, user_entity_1.User]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: '/cloudsql/cloud-398911:us-central1:polysnap',
                port: 5432,
                username: 'user',
                password: 'storypassword',
                database: 'message',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),],
        providers: [messages_service_1.MessageService, chat_service_1.ChatService, user_proxy_service_1.UserProxyService],
        controllers: [messages_controller_1.MessageController, chats_controller_1.ChatController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
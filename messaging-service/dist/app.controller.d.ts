import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createMessage(messageData: {
        topicName: string;
        message: string;
    }): Promise<string>;
}

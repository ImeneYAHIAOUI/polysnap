export declare class AppService {
    private pubsub;
    constructor();
    publishMessage(topicName: string, message: string): Promise<void>;
}

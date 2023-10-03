export declare class AppService {
    private pubsub;
    constructor();
    publishMessage(topicName: string, content: string): Promise<void>;
}

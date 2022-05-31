import {KafkaOptions, Transport} from "@nestjs/microservices";

export const microserviceConfig: KafkaOptions = {
    transport: Transport.KAFKA,

    options: {
        client: {
            brokers: ["127.0.0.1:29092"],
        },
        consumer: {
            groupId: '3',
            allowAutoTopicCreation: true,
        },
    }
};
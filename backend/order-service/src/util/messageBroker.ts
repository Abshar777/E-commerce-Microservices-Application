import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import IKafka from "../types/interface/IKafka";
import { messageType, TOPIC_TYPE } from "../types/kafkaType";
import { OderEvent } from "../types/events";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "cart-service";
const KAFKA_BROKERS = [process.env.KAFKA_BROKER_1 || "kafka:29092"];

class MessageBroker implements IKafka {
  private kafka: Kafka;
  private producer: Producer;
  constructor() {
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: KAFKA_BROKERS,
      logLevel: logLevel.INFO,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async publish(topic: TOPIC_TYPE, message: messageType, event: OderEvent) {
    await this.producer.connect();
    return await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), key: event }],
    });
  }
  async subscribe(topic: TOPIC_TYPE,groupId:string, messageHandler: Function) {
    try {
      const consumer=this.kafka.consumer({groupId})
      await consumer.connect();
      await consumer.subscribe({ topic: topic, fromBeginning: true });
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            if (message.key && message.value) {
              const inputMessage = {
                event: message.key.toString(),
                message: message.value ? JSON.parse(message.value.toString()) : null,
              };
              if (inputMessage.event && inputMessage.message) {
                await messageHandler(inputMessage);
              } else {
                console.warn(`Malformed message received: ${message}`);
              }
            }
          } catch (error) {
            console.error(`Error processing message: ${(error as Error).message}`);
          } finally {
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
          }
        },
      });
    } catch (error) {
      console.error(`Error setting up consumer: ${(error as Error).message}`);
    }
  }
}

export default MessageBroker;

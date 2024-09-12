import { Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import IKafka from "../types/interface/IKafka";
import { TOPIC_TYPE, messageType, UserEvent } from "../types/kafkaType";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "user-service";
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
  async publish(topic: TOPIC_TYPE, message: messageType, event: UserEvent) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), key: event }],
    });
  }
 
}

export default MessageBroker;

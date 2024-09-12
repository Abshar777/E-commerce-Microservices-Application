import { Consumer, Producer } from "kafkajs";
import { messageType, TOPIC_TYPE, UserEvent } from "../kafkaType";

export default interface IKafka{
    // producers
    // connectProducer():Promise<Producer>;
    // disconnectProducer():void;
    publish (topic: TOPIC_TYPE, message:messageType,event:UserEvent) : Promise<void>;
    // subscribe(topic: TOPIC_TYPE,messageHandler:Function) : Promise<void>;

}





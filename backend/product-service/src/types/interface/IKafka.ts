import { Consumer, Producer } from "kafkajs";
import { messageType, TOPIC_TYPE, ProductEvent } from "../kafkaType";

export default interface IKafka{
    // producers
    // connectProducer():Promise<Producer>;
    // disconnectProducer():void;
    publish (topic: TOPIC_TYPE, message:messageType,event:ProductEvent) : Promise<void>;
    subscribe(topic: TOPIC_TYPE,groupId:string,messageHandler:Function) : Promise<void>;

}





import { Consumer, Producer, RecordMetadata } from "kafkajs";
import { messageType, TOPIC_TYPE, } from "../kafkaType";
import { OderEvent } from "../events";

export default interface IKafka{
    // producers
    // connectProducer():Promise<Producer>;
    // disconnectProducer():void;
    publish (topic: TOPIC_TYPE, message:messageType,event:OderEvent) : Promise<RecordMetadata[]>;
    subscribe(topic: TOPIC_TYPE,groupId:string,messageHandler:Function) : Promise<void>;
    // getConsumer(groupId:string):Promise<Consumer>

}





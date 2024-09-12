import { Consumer, Producer } from "kafkajs";
import { messageType, TOPIC_TYPE, } from "../kafkaType";
import { CartEvent } from "../events";

export default interface IKafka{
    // producers
    // connectProducer():Promise<Producer>;
    // disconnectProducer():void;
    publish (topic: TOPIC_TYPE, message:messageType,event:CartEvent) : Promise<void>;
    subscribe(topic: TOPIC_TYPE,groupId:string,messageHandler:Function) : Promise<void>;
    // getConsumer(groupId:string):Promise<Consumer>

}





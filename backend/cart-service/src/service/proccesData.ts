import { Document, Model, ObjectId, UpdateQuery } from "mongoose";
import MessageBroker from "../util/messageBroker";
import { Event } from "../types/events";
import {  TPayload } from "../types/consumeMessageT";
import { TOPIC_TYPE } from "../types/kafkaType";
import { config } from "dotenv";
config()
const service=process.env.SERVICE|| "cart-service"

const Create = async <T>(id: string | ObjectId, data: T, model: Model<T>) => {
  try {
    const exist = await model.findOne({ _id: id });
    if (!exist) await model.create(data);
  } catch (err) {
    console.log((err as Error).message);
  }
};

const Update = async <T>(
  id: string | ObjectId,
  data:Record<string,any>,
  model: Model<T>
) => {
  try {
    await model.findOneAndUpdate({ _id: id }, data);
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const Delete = async <T>(id: string | ObjectId, model: Model<T>) => {
  try {
    await model.findOneAndDelete({ _id: id });
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const Upsert = async <T>(
  id: string | ObjectId,
  data: Record<string,any>,
  model: Model<T>
) => {
  try {
    await model.findOneAndUpdate({ _id: id }, data,{upsert:true});
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const proccesData = async <T extends Document>(
  topic: TOPIC_TYPE,
  groupName: string,
  model: Model<T>
) => {
  
  const kafka = new MessageBroker();

  await kafka.subscribe(
    topic,
    `${service}-${groupName}`,
    (payload: TPayload<T>) => {
      console.log(payload, "Received payload in "+ groupName);
      switch (payload.event) {
        case Event.CREATE:
          Create<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
          break;
        case Event.UPDATE:
          Update<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
          break;
        case Event.DELETE:
          Delete<T>(payload.message.data._id as string | ObjectId, model);
          break;
        case Event.UPSERT:
          Upsert<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
          break;
         
      }
    }
  );
};

export default proccesData;

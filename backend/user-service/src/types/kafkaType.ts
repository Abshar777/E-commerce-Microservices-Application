export type messageType = Record<string, any> & {
    data: any;
};

export enum UserEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}
export type TOPIC_TYPE = "User-Topic" | "Cart-Topic" | "Order-Topic";

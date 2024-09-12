export enum UserEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum ProductEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum CartEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  UPSERT = "UPSERT"
}

export enum OderEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

// globbal events
// changes from other services , this service have one addOn event UPSERT
export enum Event {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  UPSERT = "UPSERT"
}


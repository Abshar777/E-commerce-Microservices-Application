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

// globbal events
// changes from other services , this service have one addOn event UPSERT
export enum Event {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  UPSERT = "UPSERT"
}


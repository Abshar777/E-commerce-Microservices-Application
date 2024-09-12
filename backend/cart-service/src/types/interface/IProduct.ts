import { Document } from "mongoose";
import { DocumentWithId } from "../consumeMessageT";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  img?:string;
  createdAt?: Date;
  updatedAt?: Date;
  isDelete?:boolean;
}
export default IProduct;

import { Document, Types } from 'mongoose';
import IProduct from './IProduct';
import IUser from './IUser';
import { DocumentWithId } from '../consumeMessageT';

export interface CartItem {
  productId: Types.ObjectId | IProduct;
  quantity: number;
  price:number;
}

export default interface ICart extends Document {
  userId: Types.ObjectId | IUser;
  items: CartItem[];

}
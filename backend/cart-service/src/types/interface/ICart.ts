import { Document, Types } from 'mongoose';
import IProduct from './IProduct';
import IUser from './IUser';

export interface CartItem {
  productId: Types.ObjectId | IProduct;
  quantity: number;
}

export default interface ICart extends Document {
  userId: Types.ObjectId | IUser;
  items: CartItem[];

}
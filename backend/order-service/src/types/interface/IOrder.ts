import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface IOrderItem {
  productId: ObjectId;
  name: string;
  quantity: number;
  price: number;
  status: 'Pending' | 'Processed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  totalAmount: number;
  status: 'Pending' | 'Processed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentResult?: string;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
}

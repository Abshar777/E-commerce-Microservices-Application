import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types/interface/IOrder';
import IProduct from '../types/interface/IProduct';


const AddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});



const OrderItemSchema: Schema = new Schema({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
});


const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    
  },
  {
    timestamps: true, 
  }
);


const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;

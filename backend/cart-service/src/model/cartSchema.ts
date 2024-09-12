import mongoose, { Schema, Document } from 'mongoose';
import ICart from '../types/interface/ICart';  // Assume you have an ICart interface



const CartSchema: Schema<ICart> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
       
      },
    ],
   
   
  },
  {
    timestamps: true, 
  }
);

const CartModel = mongoose.model<ICart>('Cart', CartSchema);

export default CartModel;

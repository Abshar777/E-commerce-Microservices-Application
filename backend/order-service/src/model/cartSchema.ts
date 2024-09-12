import mongoose, { Schema, Document } from 'mongoose';
import ICart from '../types/interface/ICart';  



const CartSchema: Schema<ICart> = new Schema(
  {
    userId: {
      type: String,
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

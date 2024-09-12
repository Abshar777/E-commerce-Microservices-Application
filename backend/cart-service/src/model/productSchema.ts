import mongoose, { Schema } from 'mongoose';
import IProduct from '../types/interface/IProduct';




const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default:0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default:0,
    },
    img:{
      type:String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isDelete:{
      type:Boolean,
      default:false
    },
  
  },
  {
    timestamps: true, 
  }
);


const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel

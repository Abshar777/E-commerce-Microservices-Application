import { NextFunction,  Response } from "express";
import { Model } from "mongoose";
import MessageBroker from "../util/messageBroker";
import ProductModel from "../model/productSchema";
import IProduct from "../types/interface/IProduct";
import ICart from "../types/interface/ICart";
import CartModel from "../model/cartSchema";
import { AuthRequest } from "../types/api";
import { CartEvent } from "../types/events";

class UserController {
  private Kafka: MessageBroker;
  private productModel: Model<IProduct>;
  private cartModel: Model<ICart>;

  constructor() {
    this.Kafka = new MessageBroker();
    this.productModel = ProductModel;
    this.cartModel = CartModel;
  }

  //  body  id
  async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, qty = 1 } = req.body;
      const product = (await this.productModel.findById(id)) as IProduct;

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const userId = req.user;

      const updatedCart = await this.cartModel.findOneAndUpdate(
        { userId, "items.productId": id },
        {
          $set: {
            "items.$.quantity": qty,
          },
        },
        { new: true }
      );

      if (updatedCart) {
        await this.Kafka.publish("Cart-Topic",{data:updatedCart},CartEvent.UPDATE)
        return res.status(200).json({
          message: "Product quantity updated in cart",
          data: updatedCart,
        });
      } else {
        const newCart = await this.cartModel.findOneAndUpdate(
          { userId },
          {
            $push: {
              items: { productId: id, quantity: qty },
            },
          },
          { new: true, upsert: true }
        );
        await this.Kafka.publish("Cart-Topic",{data:newCart},CartEvent.UPSERT)
        return res.status(200).json({
          message: "Product added to cart",
          data: newCart,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await this.cartModel.findOne({ userId: req.user }).populate("items.productId")
      return res.status(200).json({ message: "cart found", data: cart });
    } catch (error) {
      next(error)
    }
  }

  // body id
  async removeCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {id}=req.body
      const product=await this.productModel.findById(id);
      if(!product) throw new Error("there is no product is availble on this id");
      const cart = await this.cartModel.findOneAndUpdate(
        { userId: req.user },
        { $pull: { items: { productId: id } } },
        { new: true }
      );
      if(!cart) throw new Error("there is no cart availble on this id");
      await this.Kafka.publish("Cart-Topic",{data:cart},CartEvent.UPDATE)
      return res.status(200).json({message:"product removed from cart",data:cart})
    } catch (error) {
      next(error)
    }
  }
}

export default UserController;

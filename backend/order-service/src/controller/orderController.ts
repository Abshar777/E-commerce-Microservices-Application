import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import MessageBroker from "../util/messageBroker";
import ProductModel from "../model/productSchema";
import CartModel from "../model/cartSchema";
import OrderModel from "../model/ordeSchema";
import { AuthRequest } from "../types/api";
import IProduct from "../types/interface/IProduct";
import ICart from "../types/interface/ICart";
import { IOrder } from "../types/interface/IOrder";
import { OderEvent } from "../types/events";

class UserController {
  private Kafka: MessageBroker;
  private productModel: Model<IProduct>;
  private cartModel: Model<ICart>;
  private orderModel: Model<IOrder>;

  constructor() {
    this.Kafka = new MessageBroker();
    this.productModel = ProductModel;
    this.cartModel = CartModel;
    this.orderModel = OrderModel;
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { street, city, state, postalCode, country } = req.body;
      const userId = req.user;


      const cart = await this.cartModel.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }


      let totalAmount = 0;
      const orderItems = [];
      for (const item of cart.items) {
        const product = await this.productModel.findById(item.productId) as IProduct
        if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
        if ((product.stock) as number < item.quantity) return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });

        product.stock -= item.quantity;
        const updatedProduct = await product.save();
        const productPrice=product.price * item.quantity;
        orderItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          price: productPrice,
        });

        totalAmount += productPrice;
        console.log(totalAmount, product.price, item.quantity)
        const published=await this.Kafka.publish("Order-Topic-Product", { data: updatedProduct }, OderEvent.UPDATE)
      }
      const order = await this.orderModel.create({
        userId,
        items: orderItems,
        shippingAddress: { street, city, state, postalCode, country },
        totalAmount,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
      });

      cart.items = [];
      const newCart = await cart.save();


      await this.Kafka.publish("Order-Topic-cart", { data: newCart }, OderEvent.UPDATE)

      return res.status(201).json({ message: "Order created successfully", data: order });
    
    } catch(err) {
    next(err)
  }
}

  async updateOrderItemStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { orderId, productId, status } = req.body;

    const order = await this.orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.items.find(item => item.productId.toString() === productId);
    if (!orderItem) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    orderItem.status = status;

    if (status === 'Cancelled') {
      const product = await this.productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.stock += orderItem.quantity;
      const updatedProduct = await product.save();


      await this.Kafka.publish("Order-Topic-Product", { data: updatedProduct }, OderEvent.UPDATE)
    }

    const updatedOrder = await order.save();

    return res.status(200).json({ message: "Order item status updated", data: updatedOrder });
  } catch (error) {
    next(error);
  }
}

  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = await this.orderModel.find().populate('items.product').populate('userId').sort({ createdAt: -1 }).exec();
    return res.status(200).json({ message: "Orders retrieved successfully", data: orders });
  } catch (error) {
    next(error)
  }
}

  async getOrderByUserId(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user
    const orders = await this.orderModel.find({ userId }).populate('items.product').populate('userId').sort({ createdAt: -1 }).exec();
    return res.status(200).json({ message: "Orders retrieved successfully", data: orders });
  } catch (error) {
    next(error)
  }
}

  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user;
    const orderId = req.params.order;
    const order = await this.orderModel.findOne({ userId, _id: orderId }).populate('items.product').populate('userId').sort({ createdAt: -1 }).exec();
    if (!order) return res.status(404).json({ message: "Order not found" })
    return res.status(200).json({ message: "Order retrieved successfully", data: order });
  } catch (error) {
    next(error)
  }
}




}

export default UserController

import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import MessageBroker from "../util/messageBroker";
import ProductModel from "../model/productSchema";
import IProduct from "../types/interface/IProduct";
import { ProductEvent } from "../types/kafkaType";

class UserController {
  private Kafka: MessageBroker;
  private productModel: Model<IProduct>;

  constructor() {
    this.Kafka = new MessageBroker();
    this.productModel = ProductModel;
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, description, category, stock } = req.body;
      if (!name || !price || !description || !category || !stock)
        throw new Error("less details");
      const exist = this.productModel.findOne({ name });
      if (!exist) {
        res.status(400);
        throw new Error("product already exist");
      }
      const product = await this.productModel.create({
        name,
        price,
        description,
        category,
        stock,
      });
      await this.Kafka.publish(
        "Product-topic",
        { data: product },
        ProductEvent.CREATE
      );
      res.status(200).json({
        message: "product created successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productModel.find();
      res
        .status(200)
        .json({ message: "succesfully fetch all poroducts", data: products });
    } catch (error) {
      next(error);
    }
  }

  // body  id,data
  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, data } = req.body;
      console.log(id);
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
      );
      if (!product) {
        res.status(400);
        throw new Error("product not found");
      }
      this.Kafka.publish(
        "Product-topic",
        { data: product },
        ProductEvent.UPDATE
      );
      res
        .status(200)
        .json({ message: "succefully edited producte", data: product });
    } catch (err) {
      next(err);
    }
  }

  // body  id
  async getProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productModel.findById(req.body.id);
      if (!product) {
        res.status(400);
        throw new Error("there is no product on this id");
      }
      res
        .status(200)
        .json({ message: "succesfully fetch product details", data: product });
    } catch (error) {
      next(error);
    }
  }

  // body  id
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        { isDelete: true },
        { new: true }
      );
      this.Kafka.publish(
        "Product-topic",
        { data: product },
        ProductEvent.UPDATE
      );
      if (!product) {
        await this.Kafka.publish(
          "Product-topic",
          { data: product },
          ProductEvent.UPDATE
        );
        res.status(400);
        throw new Error("there is no product on this id");
      }
      res
        .status(200)
        .json({ message: "succefully edited this producte", data: product });
    } catch (err) {
      next(err);
    }
  }

  // body id
  async recoverProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        { isDelete: false },
        { new: true }
      );
      this.Kafka.publish(
        "Product-topic",
        { data: product },
        ProductEvent.UPDATE
      );
      if (!product) {
        await this.Kafka.publish(
          "Product-topic",
          { data: product },
          ProductEvent.UPDATE
        );
        res.status(400);
        throw new Error("there is no product on this id");
      }
      res
        .status(200)
        .json({ message: "succefully edited this producte", data: product });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;

import express from "express";
import ProductController from "../controller/productController";
const Router = express.Router();
const controller = new ProductController();



Router.route("/product")
  // get all product
  .get(controller.getAllProduct.bind(controller))

  // edit product
  .put(controller.editProduct.bind(controller))

  // create product
  .post(controller.createProduct.bind(controller))

  // soft delete product
  .delete(controller.deleteProduct.bind(controller));

// recover product
Router.get("/recoverProduct",controller.editProduct.bind(controller))



export default Router;

import express from "express"
import cartController from "../controller/cartController";
const Router = express.Router();
const controller = new cartController()

Router.route('/cart')
    // get all produict in cart
    .get(controller.getCart.bind(controller))
    
    // upadate or addtocart
    .post(controller.addToCart.bind(controller))

    // remove cart
    .put(controller.removeCart.bind(controller));






export default Router
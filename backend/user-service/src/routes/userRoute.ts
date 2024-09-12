import express from "express"
import UserController from "../controller/userController";
const Router =express.Router();
const controller=new UserController()


// login user
Router.route("/login").post(controller.login.bind(controller));

// register user
Router.route("/register").post(controller.registerUser.bind(controller));


export default Router
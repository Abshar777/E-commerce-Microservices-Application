import { NextFunction, Request, Response } from "express";
import Jwt from "../util/jwt";
import userSchema, { UserDocument } from "../model/userSchema";
import { Model } from "mongoose";
import MessageBroker from "../util/messageBroker";
import { UserEvent } from "../types/kafkaType";

class UserController {
  private Jwt: Jwt;
  private UserModel: Model<UserDocument>;
  private Kafka:MessageBroker;

  constructor() {
    this.Jwt = new Jwt();
    this.UserModel = userSchema;
    this.Kafka=new MessageBroker();
  }

  // @desc     Auth user/set token
  // @route    POST /api/login
  // @access   Public
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const exist = await this.UserModel.findOne({ email });
      if (exist) {
        res.status(400);
        throw new Error("User already exists");
      }
      const user = await this.UserModel.create({ name, email, password });


      if (user) {
        const token = this.Jwt.generateToken(user._id as string);
        await this.Kafka.publish("User-Topic",{data:user},UserEvent.CREATE)
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        res.status(200).json({
          success: true,
          message: "User successfully created",
          data: user,
          token,
        });
      } else {
        res.status(400);
        throw new Error("User not created");
      }
    } catch (err) {
      next(err);
    }
  }


//@desc     Auth register user
//route     POST /api/register
//@access  Public
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        res.status(400);
        throw new Error("User not found");
      }
      const isMatch = user.comparePassword(password);
      if (!isMatch) {
        res.status(400);
        throw new Error("Password is incorrect");
      } else {
        const token = this.Jwt.generateToken(user._id as string);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        res.status(200).json({
          success: true,
          message: "User successfully logged in",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;

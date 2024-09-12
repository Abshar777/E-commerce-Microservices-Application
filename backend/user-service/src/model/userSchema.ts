import mongoose, { Document, Schema } from "mongoose";
import IUser from "../types/interface/IUser"
import bcrypt from "bcryptjs";


export interface UserDocument extends IUser,Document {
  comparePassword: (password: string) =>Boolean;
}

const userSchema: Schema<UserDocument> = new Schema({
  name: {
    type: String,
    required: [true , "name must be required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    macth: [/.+\@.+\..+/, "please use valid email"],
    
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
  },
  isAdmin: {
    default: false,
    type: Boolean,
    required: true,
  },
});


userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



userSchema.methods.comparePassword=function (password:string){
  return bcrypt.compareSync(password,this.password);
}

export default  mongoose.model("User", userSchema);

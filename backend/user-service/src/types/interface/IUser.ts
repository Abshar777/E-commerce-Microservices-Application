import { Document } from "mongoose";

interface IUser extends Document  {
    name: string;
    email:string;
    password:string;
    img?:string;
    isBlock?:boolean;
    isVerify?:boolean;
    isAdmin?:boolean
}

export default IUser
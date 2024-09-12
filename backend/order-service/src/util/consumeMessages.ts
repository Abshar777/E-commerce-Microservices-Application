import CartModel from "../model/cartSchema";
import ProductModel from "../model/productSchema";
import UserModel, { UserDocument } from "../model/userSchema";
import proccesData from "../service/proccesData";
import ICart from "../types/interface/ICart";
import IProduct from "../types/interface/IProduct";



const consumeMessages = () => {
  proccesData<UserDocument>("User-Topic", "user-group", UserModel); //for user
  proccesData<IProduct>("Product-topic", "product-group", ProductModel); //for product
  proccesData<ICart>("Cart-Topic", "cart-group", CartModel); //for cart
};

export default consumeMessages

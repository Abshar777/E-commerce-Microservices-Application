import CartModel from "../model/cartSchema";
import ProductModel from "../model/productSchema";
import proccesData from "../service/proccesData";
import ICart from "../types/interface/ICart";
import IProduct from "../types/interface/IProduct";

const consumeMessages = () => {
 
  proccesData<IProduct>("Product-topic", "product-group", ProductModel); //for product
  proccesData<ICart>("Order-Topic-cart", "cart-group", CartModel); //for cart form order
  proccesData<IProduct>("Order-Topic-Product", "product-group", ProductModel); 
};

export default consumeMessages

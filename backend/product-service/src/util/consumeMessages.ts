import ProductModel from "../model/productSchema";
import proccesData from "../service/proccesData";

import IProduct from "../types/interface/IProduct";



const consumeMessages = () => {
  proccesData<IProduct>("Order-Topic-Product", "product-group", ProductModel); //for product
};

export default consumeMessages

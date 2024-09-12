import express from 'express'
import {config} from "dotenv"
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import Router from './routes/cartRouter';
import dbConnect from './config/dbConnect';
import cookieParser from 'cookie-parser';
import authMiddilware from './middleware/authMiddileware';
import consumeMessages from './util/consumeMessages';


config();
dbConnect();
consumeMessages()

const app=express();
const port=process.env.PORT || 3001;
const apiRoot=process.env.API_ROOT || '/api/cart-service'


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(authMiddilware)
app.use(apiRoot,Router);
app.use(notFound);
app.use(errorHandler);




app.listen(port,()=>{
    console.log('user service running on '+port);
})



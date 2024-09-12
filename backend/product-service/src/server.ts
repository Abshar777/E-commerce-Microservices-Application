import express from 'express'
import {config} from "dotenv"
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import MessageBroker from "./util/messageBroker";
import Router from './routes/productRoute';
import dbConnect from './config/dbConnect';
import consumeMessages from './util/consumeMessages';

config()
dbConnect()
consumeMessages()
const app=express();
const port=process.env.PORT || 3001;
const apiRoot=process.env.API_ROOT || '/api/product-service'


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(apiRoot,Router)
app.use(notFound);
app.use(errorHandler);




app.listen(port,()=>{
    console.log('user service running on '+port);
})



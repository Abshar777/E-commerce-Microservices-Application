import {connect} from 'mongoose'

export default async function dbConnect(){
    const uri= "mongodb+srv://absharameen625:123@cluster0.pkbgb.mongodb.net/user-service"
    await connect(uri).then(_=>{
        console.log("Connected to MongoDB")
    }).catch(err=>{
        console.log("while connecting ",err.message);
    })
}
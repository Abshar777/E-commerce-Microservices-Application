import {connect} from 'mongoose'

export default async function dbConnect(){
    const uri=process.env.MONGO_URI || ""
    await connect(uri).then(_=>{
        console.log("Connected to MongoDB")
    }).catch(err=>{
        console.log("while connecting ",err.message);
    })
}
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

 const connectdb = async ()=>{
    try{
     const dbconnection= await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
     console.log(`\n the db is connectede and 👍 ${dbconnection.connection.host}`)
    }catch(error){
     console.log(`db connection error ${error}`)
     process.exit(1)
    }
 }
 export default connectdb
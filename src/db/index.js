import mongoose from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const connectToMongodb=async()=>{

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("Database connectd");
}).catch((err)=>{
    console.log(err);
})

}


export default connectToMongodb
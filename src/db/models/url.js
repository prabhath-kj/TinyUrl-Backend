import {Schema,model} from "mongoose"


const urlSchema =new Schema({
    originalUrl: String,
    shortCode: String,
    analytics: {
      clicks: Number,
      lastClickedAt: Date
    }
})

const Url =model("Url",urlSchema)
export default Url
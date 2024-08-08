import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({
    path:"../config/.env"
})
const connectDb =  () => {
  mongoose.connect(process.env.MONGO_URI).then( () => {
    console.log("database connected")
  }).catch((err) => {
    console.log(err)
  })
}
export default connectDb
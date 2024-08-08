import express from 'express';
import dotenv from 'dotenv' ;
import connectDb from "./config/db.js"
import bodyParser from "body-parser";
import CookieParser from "cookie-parser"
import userRoute from "./routes/userRoute.js "
import tweetRoute from "./routes/tweetRoute.js"
import cors from "cors"

dotenv.config({
    path:".env"
})

connectDb();
const app = express();
//basic middlewares ------------------
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json( ));
app.use(CookieParser())
const corsOptions ={
    origin:["http://localhost:3000","https://cross-blue-bird.netlify.app"],
    credentials:true
}
app.use(cors(corsOptions))

//---------API'S------------
app.use("/api/v1/user",userRoute)

app.use("/api/v1/tweet",tweetRoute)



app.listen(process.env.PORT, (err) => {
    if(err) console.log(err);
    console.log(`server is running at ${process.env.PORT }`)
})
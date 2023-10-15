import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
})

const app=express();
app.use(express());

app.use("/user", userRouter);

app.listen(3000, ()=>{
    console.log("server running on port : 3000");
});
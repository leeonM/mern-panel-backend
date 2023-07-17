import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import adminRoute from "./routes/admin.route.js"
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser"

const app = express()
dotenv.config()


app.use(cors({
       origin: ["http://localhost:3000","https://mern-panel.onrender.com","https://mern-panel.onrender.com/"]
    }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));


const connect = () =>{
    try {
     mongoose.connect(process.env.MONGO_URL).then(
        console.log("Connected to MongoDB")
     )
    } catch (error) {
        console.log(error)
    }
}

app.use("/api/admin",adminRoute)
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)

app.listen(8000, ()=>{
    console.log("App connected successfully")
    connect()
})

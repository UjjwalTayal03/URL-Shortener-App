import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import urlRoutes from "./routes/UrlRoutes.js"

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/",urlRoutes)




app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})
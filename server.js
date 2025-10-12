import express from "express"
import MainRouter from "./src/routes/index.js"
import dotenv from "dotenv"
import {errorHandler} from "./src/middleware/errorHandler.js"


dotenv.config()

let app=express()

app.use(express.json())

app.use("/api",MainRouter)


app.use(errorHandler)

app.listen(process.env.Port,()=>{
    console.log(`Server running on port ${process.env.Port}`)
})
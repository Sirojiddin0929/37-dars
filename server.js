import express from "express"
import dotenv from "dotenv"
import {errorHandler} from "./src/middleware/errorHandler.js"
import PrimeRouter from "./src/routes/index.js"


dotenv.config()

let app=express()

app.use(express.json())

app.use("/api",PrimeRouter)


app.use(errorHandler)

app.listen(process.env.Port,()=>{
    console.log(`Server running on port ${process.env.Port}`)
})
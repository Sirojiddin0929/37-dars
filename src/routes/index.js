import { Router } from "express";
import setUpRouter from "./setUp.route.js";
import userRouter from "./user.route.js";
import boardRouter from "./board.route.js";

let PrimeRouter=Router()

PrimeRouter.use("/setUp",setUpRouter)
PrimeRouter.use("/boards",boardRouter)
PrimeRouter.use("/users",userRouter)

export default PrimeRouter
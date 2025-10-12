import { Router } from "express";
import setUpRouter from "./setUp.route.js";
import userRouter from "./user.route.js";
import boardRouter from "./board.route.js";

let MainRouter=Router()

MainRouter.use("/setUp",setUpRouter)
MainRouter.use("/boards",boardRouter)
MainRouter.use("/users",userRouter)

export default MainRouter
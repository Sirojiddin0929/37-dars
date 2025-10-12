import { Router } from "express";
import {setUpTables} from "../controllers/setUp.controller.js"

let setUpRouter=Router()

setUpRouter.post("/",setUpTables)

export default setUpRouter
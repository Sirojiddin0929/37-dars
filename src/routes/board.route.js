import { taskSchema,taskSchemaUpdate} from "../validations/task.validation.js";
import { columnSchema,columnSchemaUpdate } from "../validations/column.validation.js";
import { boardSchema,boardSchemaUpdate } from "../validations/board.validation.js";
import { validateRequest } from "../middleware/validate.js";
import { Router } from "express";
import { boardController } from "../controllers/board.controller.js";
import { checkLogin } from "../middleware/checklogin.js";
import {columnController} from "../controllers/column.controller.js"
import {taskController} from "../controllers/tasks.controller.js"

let boardRouter=Router()
let board=new boardController()
let task =new taskController()
let column =new columnController()

boardRouter.get("/",board.GetAll)
boardRouter.get("/:boardId",board.GetOne)

boardRouter.get("/:boardId/columns",column.GetAll)
boardRouter.get("/:boardId/columns/:columnId",column.GetOne)

boardRouter.get("/:boardId/columns/:columnId/tasks",task.GetAll)
boardRouter.get("/:boardId/columns/:columnId/tasks/:taskId",task.GetOne)

boardRouter.use(checkLogin)
boardRouter.post("/",validateRequest(boardSchema),board.create)
boardRouter.put("/:boardId",validateRequest(boardSchemaUpdate),board.update)
boardRouter.delete("/:boardId",board.delete)

boardRouter.post("/:boardId/columns",validateRequest(columnSchema),column.create)
boardRouter.put("/:boardId/columns/:columnId",validateRequest(columnSchemaUpdate),column.update)
boardRouter.delete("/:boardId/columns/:columnId",column.delete)

boardRouter.post("/:boardId/columns/:columnId/tasks",validateRequest(taskSchema),task.create)
boardRouter.put("/:boardId/columns/:columns/tasks/:taskId",validateRequest(taskSchemaUpdate),task.update)
boardRouter.delete("/:boardId/columns/:columnId/tasks/:taskId",task.delete)

export default boardRouter
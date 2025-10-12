import {userSchema, userSchemaUpdate} from "../validations/user.validation.js"
import { validateRequest } from "../middleware/validate.js"
import { checkLogin } from "../middleware/checklogin.js"
import {userController} from "../controllers/user.controller.js"
import { Router } from "express"

let userRouter=Router()
let user=new userController()

userRouter.post("/register",validateRequest(userSchema),user.create)
userRouter.post("/login",user.loginCheck)
userRouter.use(checkLogin)

userRouter.get("/",user.GetAll)
userRouter.get("/:id",user.GetOne)
userRouter.put("/:id",validateRequest(userSchemaUpdate),user.update)
userRouter.delete("/:id",user.delete)
userRouter.post("/logout",user.logOut)

export default userRouter

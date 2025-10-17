import {userSchema, userSchemaUpdate,updatePasswordScheme} from "../validations/user.validation.js"
import { validateRequest } from "../middleware/validate.js"
import { checkLogin } from "../middleware/checklogin.js"
import {userController} from "../controllers/user.controller.js"
import { Router } from "express"

let userRouter=Router()
let user=new userController()

userRouter.post("/register",validateRequest(userSchema),user.create)
userRouter.post("/login",user.loginCheck)
userRouter.use(checkLogin)
userRouter.post("/logout",user.logOut)

userRouter.get("/",user.getAll)
userRouter.get("/:id",user.getOne)
userRouter.put("/:id",validateRequest(userSchemaUpdate),user.update)
userRouter.patch("/:id/password", validateRequest(updatePasswordScheme), user.changePassword)
userRouter.delete("/:id",user.delete)


export default userRouter

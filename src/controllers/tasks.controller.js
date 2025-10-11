import { checkuser } from "../helpers/checkuser.js";
import { Create,getOne } from "../helpers/crud.js";
import classController from "./class.controller.js";



export class taskController extends classController{
    constructor(){
        super("tasks", "id", "taskId")
    }
    buildWhere(req){
        const where = {...this.whereSearch}
        for(const [key, value] of Object.entries(req.params)){
            if(key === "columnId" && this.table === "tasks"){
                where["column_id"] = value
            }
        }
        return where
    }

    create = async (req, res, next)=>{
            try{
                const { columnId } = req.params
                const data = req.body
                const column = await getOne(columnId, "columns")
                if (!column) return res.status(404).json({ message: "Column not found" })

                let { title, description, order_num } = data
                const user_id = await checkuser()
                const result = await Create({ title, description, order_num, user_id, column_id: columnId }, this.table)
                res.status(201).json(result)
            }catch(err){
                next(err)
            }
    }
}
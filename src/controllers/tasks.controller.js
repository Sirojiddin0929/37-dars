import { checkuser } from "../helpers/checkuser.js";
import { create,getOne } from "../helpers/crud.js";
import classController from "./class.controller.js";
import { getAll } from "../helpers/crud.js";


export class taskController extends classController{
    constructor(){
        super("tasks", "id", "taskId")
    }
    fundament(req){
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
                const result = await create({ title, description, order_num, user_id, column_id: columnId }, this.table)
                res.status(201).json(result)
            }catch(err){
                next(err)
            }
    }
    getAll = async (req, res, next) => {
  try {
    const search = req.query.search?.toLowerCase() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const tasksData = await getAll(this.table, this.fundament(req));
    let tasks = tasksData.data;

   
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.id?.toLowerCase().includes(search) ||
          task.title?.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search)||
          task.user_id?.toLowerCase().includes(search) ||
          task.column_id?.toLowerCase().includes(search)
      );
    }

   
    const total = tasks.length;
    const totalPages = Math.ceil(total / limit);

    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    
    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data: paginatedTasks,
    });
  } catch (err) {
    next(err);
  }
};

}
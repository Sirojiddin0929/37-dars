import { create,getAll,getOne } from "../helpers/crud.js";
import classController from "./class.controller.js";


export class columnController extends classController{
    constructor(){
        super("columns", "id", "columnId")
    }
    create = async (req, res, next)=>{
            try{
                const data = req.body
                let { title, order_num = 0,description } = data
                const { boardId } = req.params
                const result = await create({ title, order_num, description,board_id: boardId }, this.table)
                res.status(201).json({
                    message: "Column created successfully",
                    data: result
                })
            }catch(err){
                next(err)
            }
    }
    getOne = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
    
                const result = await getOne(id, this.table, this.fundament(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                const tasks = await getAll("tasks", { column_id: id })
                result.tasks = tasks.data

                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
    getAll = async (req, res, next) => {
  try {
    const columnsData = await getAll(this.table, this.fundament(req));
    let columns = columnsData.data;

    if (!columns || columns.length === 0) {
      return res.status(404).json({
        message: `${this.table.slice(0, -1)} not found`,
      });
    }

   
    const search = req.query.search?.toLowerCase() || "";

    
    if (search) {
      columns = columns.filter((col) =>
        col.title?.toLowerCase().includes(search)
      );
    }

    
    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        const tasks = await getAll("tasks", { column_id: column.id });
        column.tasks = tasks.data;
        return column;
      })
    );

   
    res.status(200).json({
      total: columnsWithTasks.length,
      data: columnsWithTasks,
    });
  } catch (err) {
    next(err);
  }
};


}
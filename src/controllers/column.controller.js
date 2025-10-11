import { Create,getAll,getOne } from "../helpers/crud.js";
import classController from "./class.controller.js";


export class columnController extends classController{
    constructor(){
        super("columns", "id", "columnId")
    }
    create = async (req, res, next)=>{
            try{
                const data = req.body
                let { title, order_num = 0 } = data
                const { boardId } = req.params
                const result = await Create({ title, order_num, board_id: boardId }, this.table)
                res.status(201).json({
                    message: "Column created successfully",
                    data: result
                })
            }catch(err){
                next(err)
            }
    }
    GetOne = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
    
                const result = await getOne(id, this.table, this.buildWhere(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                const tasks = await getAll("tasks", { column_id: id })
                result.tasks = tasks.data

                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
    GetAll = async(req, res, next)=>{
            try{
                const columnsData = await getAll(this.table, this.buildWhere(req));
                const columns = columnsData.data;

                if (!columns || columns.length === 0)
                    return res
                    .status(404)
                    .json({ message: `${this.table.slice(0, -1)} not found` })
                    
                const columnsWithTasks = await Promise.all(
                    columns.map(async(column)=>{
                        const tasks = await getAll("tasks", {column_id: column.id})
                        column.tasks = tasks.data
                        return column
                    })
                )
                
                res.status(200).json({
                    total: columnsData.total,
                    data: columnsWithTasks
                })
            }catch(err){
                next(err)
            }
        }
}
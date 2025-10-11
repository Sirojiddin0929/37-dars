import { Create,Delete,Update,getAll,getOne } from "../helpers/crud.js";

export default class classController{
    constructor(table,tableColumn="id",paramsId="id",whereSearch={}){
        this.table=table
        this.tableColumn=tableColumn
        this.paramsId=paramsId
        this.whereSearch=whereSearch

    }
    buildWhere(req) {
        const where = { ...this.whereSearch }

        for (const [key, value] of Object.entries(req.params)) {
        if (key.endsWith("Id")) {
            let mainkey = key.replace("Id", "")
            let currentTable = this.table.replace(/s$/, "")
            let field

            if (mainkey === currentTable) {
            field = this.tableColumn
            } else {
            field = `${mainkey}_id`
            }

            if (!isNaN(value)) {
            where[field] = parseInt(value)
            }
        }
        }

        return where
    }
    create = async (req, res, next)=>{
            try{
                const data = req.body
                const result = await Create(data, this.table)
                res.status(201).json(result)
            }catch(err){
                next(err)
            }
        }

    update = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
                const data = req.body
    
                const result = await Update(id, data, this.table, this.buildWhere(req), this.tableColumn)
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
    
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }

    delete = async(req, res, next)=>{
            try{
                const id = req.params[this.paramsId]

    
                const result = await Delete(id, this.table, this.buildWhere(req),  this.tableColumn)
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json({message: `${this.table.slice(0, -1)} deleted duccessfully`, data: result})
            }catch(err){
                next(err)
            }
        }

    GetOne = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
    
                const result = await getOne(id, this.table, this.buildWhere(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
    GetAll = async(req, res, next)=>{
            try{
                const result = await getAll(this.table, this.buildWhere(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
}

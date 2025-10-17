import { create,remove,update,getAll,getOne } from "../helpers/crud.js";

export default class classController{
    constructor(table,tableColumn="id",paramsId="id",whereSearch={}){
        this.table=table
        this.tableColumn=tableColumn
        this.paramsId=paramsId
        this.whereSearch=whereSearch

    }
    fundament(req) {
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

            
            where[field] = value
            
        }
        }

        return where
    }
    create = async (req, res, next)=>{
            try{
                const data = req.body
                const result = await create(data, this.table)
                res.status(201).json(result)
            }catch(err){
                next(err)
            }
        }

    update = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
                const data = req.body
    
                const result = await update(id, data, this.table, this.fundament(req), this.tableColumn)
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
    
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }

    delete = async(req, res, next)=>{
            try{
                const id = req.params[this.paramsId]

    
                const result = await remove(id, this.table, this.fundament(req),  this.tableColumn)
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json({message: `${this.table.slice(0, -1)} deleted duccessfully`, data: result})
            }catch(err){
                next(err)
            }
        }

    getOne = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
    
                const result = await getOne(id, this.table, this.fundament(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
    getAll = async(req, res, next)=>{
            try{
                const result = await getAll(this.table, this.fundament(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
}

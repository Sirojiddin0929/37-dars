import fs from "fs/promises"
import pool from "../config/database.js"
import path from "path"


export let setUpTables=async(req,res)=>{
    try{
        let filePath=path.resolve("src/database/database.sql")
        let query=await fs.readFile(filePath,"utf-8")
        await pool.query(query)
        res.json({message: "hammasi tayyor"})

    }catch(error){
        res.status(500).json({message:error.message})
        
    }
}
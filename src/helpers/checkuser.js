import pool from "../config/database.js";
import { readUser } from "./file.js";

export async function checkuser() {
    let login=await readUser()
    if(!login){
        return null
    }
    let email=login.email

    let query=`
    SELECT id FROM users WHERE email=$1;
    `
    let natija=await pool.query(query,[email])
    if(natija.rows.length===0){
        return null
    }
    return natija.rows[0].id
    
}
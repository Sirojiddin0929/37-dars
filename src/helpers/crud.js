import pool from "../config/database.js";

async function Create(data,table) {
    try{
        let keys=Object.keys(data)
        let values=Object.values(data)

        let placeholders=keys.map((key,index)=>`$${index+1}`).join(", ")
        let query=`
        INSERT INTO ${table}(${keys.join(", ")})
        VALUES(${placeholders})
        RETURNING *;
        `
        let res = await pool.query(query,values)
        console.log(`Qatorlar qoshildi ${table}`,res.rows[0])
        return res.rows[0]
    }catch(err){
        console.error("Error",err)
        throw err

    }
    
}

async function Update(id,data,table,where={},tableColumn="id") {
    try{
        let keys=Object.keys(data)
        if(keys.length===0){
            return null
        }
        let whereKeys=Object.keys(where)

        let values=[...Object.values(data),id, ...Object.values(where)]

        let temp=keys
        .map((key,index)=>`${key}=$${index+1}`)
        .join(", ")
        let whereSearch=`WHERE ${tableColumn}=$${key.length+1}`
        if(whereKeys.length>0){
            let extra=whereKeys.map((key,i)=>`${key}=${key.length+2+i}`).join(" AND ")
            whereSearch+=` AND ${extra}`
        }

        let query=`
        UPDATE ${table}
        SET ${temp}
        ${whereSearch}
        RETURNING *;
        `
        let res=await pool.query(query,values)
        console.log(`Ozgartirildi ${table}`,res.rows[0])
        return res.rows[0] || null

    }catch(err){
        console.error("Error",err)
        throw err
    }
}

async function Delete(id,table,where={},tableColumn="id") {
    let whereKeys=Object.keys(where)
    let values=[id,...Object.values(where)]

    let whereSearch=`WHERE ${tableColumn}=$1`
    if(whereKeys.length>0){
        let extra=whereKeys.map((key,i)=>`${key}=$${i+2}`).join(" AND ")
        whereSearch+=` AND ${extra}`
    }

    let query=`
    DELETE FROM 
    ${table}
    ${whereSearch}
    RETURNING *;
    `
    try{
        let res= await pool.query(query,values)
        if(res.rows.length===0){
            console.log(`Malumot ${table} topilmadi`)
            return null
        }
        console.log("Malumot: ",res.rows[0])

    }catch(err){
        console.log(err)

    }
}

async function getOne(value,table,where={},tableColumn="id") {
    try{
        let keys=Object.keys(where)
        let values=[value,...Object.values(where)]

        let whereSearch=""
        if(keys.length>0){
            let temp=keys.temp((key,i)=>`${key}=$${i+2}`).join(" AND ")
            whereSearch=` AND ${temp}`
        }

        let query=`SELECT * FROM ${table} WHERE ${tableColumn}=$1 ${whereSearch}`

        let res = await pool.query(query,values)
        return res.rows[0]
    }catch(err){
        console.error("Error",err)
    }
    
}

async function getAll(table,where={},page=1,limit=10) {
    try{
        let offset=(page-1)*limit

        let keys=Object.keys(where)
        let values=Object.values(where)

        let whereSearch=""
        if(key.length>0){
            let temp = keys.map((key,i)=>`${key}=$${i+1}`).join(" AND ")
            whereSearch=`WHERE ${temp}`
        }
        let query=`
        SELECT * FROM ${table} ${whereSearch} ORDER BY id LIMIT $${keys.length+1}
        OFFSET $${keys.length+2};
        `
        let res= await pool.query(query,[...values,limit,offset])
        let total=res.rowCount
        let totalPages=Math.ceil(total/limit)
        return {
            page,
            limit,
            total,
            totalPages,
            data:res.rows
        }

    }catch(err){
        console.error("Error",err)
    }
}

export {getAll,getOne,Create,Update,Delete}
import fs from "fs/promises"

let filePath="/src/config/currentUser.json"

export let saveUser= async(data)=>{
    await fs.writeFile(filePath,JSON.stringify(data))

}

export let readUser=async()=>{
    let user1=await fs.readFile(filePath)
    return JSON.parse(user1)
}

export let clearUser=async()=>{
    try{
        await fs.writeFile(filePath,JSON.stringify({}))
    }catch(err){
        console.error("Error",err)
    }

}

import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config()

const {DB_HOST, DB_PORT,DB_DATABASE,DB_PASSWORD,DB_USER}=process.env
const pool=new Pool({
    host:DB_HOST,
    password:DB_PASSWORD,
    port:DB_PORT,
    database:DB_DATABASE,
    user:DB_USER
})

pool.connect()
.then(()=>console.log("Database muvafaqqiyatli ulandi"))
.catch((err)=>console.error("Xatolik"),err)

export default pool
import pool from "../config/database.js";
import { readUser } from "../helpers/file.js";
import * as bcrypt from "bcrypt"

export const checkLogin = async (req, res, next)=>{
    try{
        
        if (req.path === "/login" && req.method === "POST"){
            const { email, password } = req.body;

            if (!email || !password) 
                return res.status(400).json({ message: "Email and parol are required!" });
            
            
            const query = `
            SELECT * 
            FROM users
            WHERE email = $1;`
            const result = await pool.query(query, [email])
            if (result.rows.length === 0)
                return res.status(401).json({ message: "Email or password is incorrect!" })
            
            const user = result.rows[0]
            const checkPassword = await bcrypt.compare(password, user.password)

            if (!checkPassword) 
                return res.status(401).json({ message: "Password is incorrect. Try again or register!" })

            return next();
        }

       
        const savedUser = await readUser();

        if (!savedUser || Object.keys(savedUser).length === 0) return res.status(401).json({ message: "Please, Log In!" })

        const query = `
        SELECT * FROM users
        WHERE email = $1;
        `;
        const result = await pool.query(query, [savedUser.email])

        const user = result.rows[0]
        const checkPassword = await bcrypt.compare(savedUser.password, user.password)
        if (!checkPassword) 
            return res.status(401).json({ message: "Invalid Data!" })


        next()


    }catch(err){
        next(err)
    }
}
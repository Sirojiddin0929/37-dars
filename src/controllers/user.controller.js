import { Create,Delete,Update,getAll,getOne } from "../helpers/crud.js";
import { clearUser, readUser, saveUser } from "../helpers/file.js";
import classController from "./class.controller.js";
import * as bcrypt from "bcrypt";
import pool from "../config/database.js";
import { checkuser } from "../helpers/checkuser.js";

export class userController extends classController {
  constructor() {
    super("users", "id");
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;
      const { name, email, password } = data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await Create(
        { name, email, password: hashedPassword },
        this.table
      );
      res.status(201).json({
        message: "Account Created Successfully",
        data: {
          id: result.id,
          name: result.name,
          email: result.email,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body
      const userID = await checkuser();
      if (!userID)
        return res.status(403).json({ message: "User not logged in!" });

      if (userID !== parseInt(id))
        return res
          .status(400)
          .json({ message: `You cannot change other's data!` });
      const result = await Update(id, data, this.table, this.tableColumn);
      if (!result)
        return res
          .status(404)
          .json({ message: `${this.table.slice(0, -1)} not found` });
      const savedUser = await readUser();
      await saveUser({
        email: value.email ? value.email : result.email,
        password: value.password ? value.password : savedUser.password,
      });

      const { password, ...rest } = result;
      res.status(200).json({
        message: "User updated successfully",
        data: rest,
      });
    } catch (err) {
      next(err);
    }
  };
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userID = await checkuser();
      if (!userID)
        return res.status(403).json({ message: "User not logged in!" });

      if (userID !== parseInt(id))
        return res
          .status(400)
          .json({ message: `You cannot delete other's data!` });

      const result = await Delete(id, this.table, this.tableColumn);
      if (!result)
        return res
          .status(404)
          .json({ message: `${this.table.slice(0, -1)} not found` });
      await clearUser();
      const { password, ...rest } = result;
      res.status(200).json({
        message: "User deleted successfully",
        data: rest,
      });
    } catch (err) {
      next(err);
    }
  };

  GetOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await getOne(id, this.table);
      if (!result)
        return res
          .status(404)
          .json({ message: `${this.table.slice(0, -1)} not found` });

      const { password, ...rest } = result;
      res.status(200).json(rest);
    } catch (err) {
      next(err);
    }
  };
  GetAll = async (req, res, next) => {
    try {
      const result = await getAll(this.table);
      if (!result)
        return res
          .status(404)
          .json({ message: `${this.table.slice(0, -1)} not found` });

      result.data = result.data.map(({ password, ...rest }) => rest);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  loginCheck = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res
          .status(400)
          .json({ message: "Email and parol are required!" });

      const query = `
            SELECT * FROM users
            WHERE email = $1`;
      const result = await pool.query(query, [email]);
      if (result.rows.length === 0)
        return res.status(400).json({ message: "Email is incorrect!" });

      const checkPassword = await bcrypt.compare(
        password,
        result.rows[0].password
      );
      if (!checkPassword)
        return res.status(400).json({ message: "Password is incorrect!" });

      await saveUser({ email, password });

      const { password: _, ...rest } = result.rows[0];
      res.json({ message: "Login Succesfully!", user: rest });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  logOut = async (req, res) => {
    await clearUser();
    res.json({ message: "You logged out successfully!" });
  };
}
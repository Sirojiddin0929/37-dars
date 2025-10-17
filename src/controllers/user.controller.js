import { create,remove,update,getAll,getOne } from "../helpers/crud.js";
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
      const result = await create(
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
    const id = req.params.id;
    const data = req.body;

    if (!isNaN(id))
      return res.status(400).json({ message: "Invalid ID!" });

    const userID = await checkuser();
    if (!userID)
      return res.status(403).json({ message: "User not logged in!" });

    if (userID !== id)
      return res.status(400).json({ message: "You cannot change other's data!" });

    const result = await update(id, data, "users", {}, "id");


    if (!result)
      return res.status(404).json({ message: "User not found" });

    const savedUser = await readUser();

    await saveUser({
      email: data.email ? data.email : result.email,
      password: data.password ? data.password : savedUser.password,
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

      if (userID !== id)
        return res
          .status(400)
          .json({ message: `You cannot delete other's data!` });

      const result = await remove(id, this.table,{},this.tableColumn);
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

  getOne = async (req, res, next) => {
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
  getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    
    const searchColumns = ["name", "email","id"];

    const result = await getAll(this.table, {}, page, limit, search, searchColumns);

    if (!result || result.data.length === 0) {
      return res.status(404).json({
        message: `${this.table.slice(0, -1)} not found`,
        ...result
      });
    }

    
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
  changePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "Missing fields" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "New passwords do not match" });

    const q = await pool.query("SELECT password FROM users WHERE id = $1", [id]);
    const user = q.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) return res.status(400).json({ message: "New password must be different" });

    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = await update(id, { password: hashed }, "users", {}, "id");

    if (!updated) return res.status(500).json({ message: "Could not update password" });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

}
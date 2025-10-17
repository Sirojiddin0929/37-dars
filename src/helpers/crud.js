import pool from "../config/database.js";

async function create(data, table) {
  try {
    let keys = Object.keys(data);
    let values = Object.values(data);

    let placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    let query = `
      INSERT INTO ${table}(${keys.join(", ")})
      VALUES(${placeholders})
      RETURNING *;
    `;
    let res = await pool.query(query, values);
    console.log(`Qatorlar qo'shildi ${table}`, res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}


async function update(id, data, table, where = {}, tableColumn = "id") {
  try {
    id = id;
    if (!isNaN(id)) throw new Error("Invalid ID type (must be uuid)");

    let keys = Object.keys(data);
    if (keys.length === 0) return null;

    let whereKeys = Object.keys(where);
    let values = [...Object.values(data), id, ...Object.values(where)];

    let temp = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
    let whereSearch = `WHERE ${tableColumn}=$${keys.length + 1}`;

    if (whereKeys.length > 0) {
      let extra = whereKeys
        .map((key, i) => `${key}=$${keys.length + 2 + i}`)
        .join(" AND ");
      whereSearch += ` AND ${extra}`;
    }

    let query = `
      UPDATE ${table}
      SET ${temp}
      ${whereSearch}
      RETURNING *;
    `;

    let res = await pool.query(query, values);
    console.log(`O'zgartirildi ${table}`, res.rows[0]);
    return res.rows[0] || null;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}



async function remove(id, table, where = {}, tableColumn = "id") {
  let whereKeys = Object.keys(where);
  let values = [id, ...Object.values(where)];

  let whereSearch = `WHERE ${tableColumn}=$1`;
  if (whereKeys.length > 0) {
    let extra = whereKeys.map((key, i) => `${key}=$${i + 2}`).join(" AND ");
    whereSearch += ` AND ${extra}`;
  }

  let query = `
    DELETE FROM ${table}
    ${whereSearch}
    RETURNING *;
  `;

  try {
    let res = await pool.query(query, values);
    if (res.rows.length === 0) {
      console.log(`Ma'lumot ${table} topilmadi`);
      return null;
    }
    console.log("O'chirildi: ", res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}


async function getOne(value, table, where = {}, tableColumn = "id") {
  try {
    let keys = Object.keys(where);
    let values = [value, ...Object.values(where)];

    let whereSearch = "";
    if (keys.length > 0) {
      let temp = keys.map((key, i) => `${key}=$${i + 2}`).join(" AND ");
      whereSearch = ` AND ${temp}`;
    }

    let query = `SELECT * FROM ${table} WHERE ${tableColumn}=$1 ${whereSearch}`;
    let res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}


async function getAll(table, where = {}, page =1,limit=10, search = "", searchColumns = []) {
  try {
    
    const offset = (page - 1) * limit;
    const keys = Object.keys(where);
    const values = Object.values(where);

    let whereSearch = "";
    if (keys.length > 0) {
      whereSearch = "WHERE " + keys.map((k,i) => `${k}=$${i+1}`).join(" AND ");
    }

    if (search && searchColumns.length > 0) {
      
      
      const searchConditions = searchColumns.map((col,i)=> (col === "id"
            ? `CAST(${col} AS TEXT) ILIKE $${values.length + i + 1}`
            : `${col} ILIKE $${values.length + i + 1}`)
      );
      searchColumns.forEach(()=>values.push(`%${search}%`))
      whereSearch += whereSearch
        ? ` AND (${searchConditions.join(" OR ")})`
        : `WHERE (${searchConditions.join(" OR ")})`;
      

    }

    
    const countQuery = `SELECT COUNT(*) AS total FROM ${table} ${whereSearch}`;
    const countRes = await pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].total, 10); 
    const totalPages = Math.ceil(total / limit);

    if (total === 0) return { page, limit, total: 0, totalPages: 0, data: [] };

    const query = `
      SELECT * FROM ${table} ${whereSearch}
      ORDER BY id
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2};
    `;
    const res = await pool.query(query, [...values, limit, offset]);
    return { page, limit, total, totalPages, data: res.rows };
  } catch (err) {
    console.error("Error in getAll:", err);
    throw err;
  }
}



export { getAll, getOne, create, update, remove };

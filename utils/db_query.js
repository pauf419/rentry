const pool = require("../db/postgress-pool");

class DB {
  async query(query, data, first) {
    return await pool.query(query, data).then((data) => {
      if (first) return data.rows[0];
      return data.rows;
    });
    /*return new Promise(async (resolve, reject) => {
      await pool.all(query, data, (err, rows) => {
        if (err) return reject(err);
        if (first) return resolve(rows[0]);
        return resolve(rows);
      });
    });*/
  }
}

module.exports = new DB();

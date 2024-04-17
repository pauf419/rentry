const Pool = require("pg").Pool
const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("./root.db", (error) => {
if (error) {
    return console.error(error.message);
}
}); 

module.exports = db
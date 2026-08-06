const pool = require('../../config/db');

exports.fetch_industries = async () => {
    const [rows] = await pool.execute('SELECT * FROM industries');
    return rows;
}
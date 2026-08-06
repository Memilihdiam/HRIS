const pool = require('../../config/db');

/**
 * Auth User by id
 * @param {String} - User code
 * @param {String} - Password user
 * @return {Promise<String>} - The object user found
 */ 
exports.find_user_for_login = async (employee_code) => {
    const [rows] = await pool.execute(`
        SELECT * FROM employees WHERE employee_code = ?`, [employee_code]);
    return rows[0];
};
const pool = require('../config/db');

/**
 * Auth User by id
 * @param {String} - User code
 * @return {Promise<String>} - The object user found
 */ 
exports.find_user_for_login = async (employee_code) => {
    const [rows] = await pool.execute(`
        SELECT 
            e.*, 
            p.position_code,
            d.department_code
        FROM employers e
        JOIN positions p ON e.position_id = p.id
        JOIN departments d ON e.position_id = d.id
        WHERE e.employee_code = ?`, [employee_code]);
    return rows[0];
};
const pool = require('../../config/db');

/**
 * Get User By Id
 * @param {String} id - Parameter employer id
 * @return {Promise<String>} - The object user data found
 */
exports.find_user_by_id = async (id) => {
    const [rows] = await pool.execute(`
        SELECT 
            e.employee_code,
            e.name,
            e.gender,
            e.address,
            e.date_of_birth,
            e.email,
            e.telephone_number,
            e.bank_name,
            e.account_number,
            e.join_date,
            e.employement_status,
            e.ptkp_status,
            d.department_name AS department_name,
            d.department_code AS department_code,
            p.position_name AS position_name,
            p.position_code AS position_code
        FROM employers e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN positions p ON e.position_id = p.id
        WHERE e.id = ?
    `, [id]);

    return rows[0]; 
}
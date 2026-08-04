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
            e.ptkp_status,
            es.status AS status_name,
            d.department_name AS department_name,
            d.department_code AS department_code,
            p.position_name AS position_name,
            p.position_code AS position_code
        FROM employees e
        LEFT JOIN employees_employment_status ees ON ees.employee_id = e.id
        LEFT JOIN employment_status es ON  es.id = ees.status_id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN positions p ON e.position_id = p.id
        WHERE e.id = ?
    `, [id]);

    return rows[0]; 
}
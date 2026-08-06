const pool = require('../../config/db');

/**
 * Get User By Id
 * @param {String} id - Parameter employer id
 * @return {Promise<String>} - The object user data found
 */
exports.find_user_by_id = async (id) => {
    const [rows] = await pool.execute(`
        SELECT
            e.id,
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
            es.status_name AS employement_status,
            r.role_name AS role_name,
            d.department_name AS department_name,
            dp.position_name AS position_name
        FROM employees e
        LEFT JOIN employee_roles er ON er.employee_id = e.id
        LEFT JOIN roles r ON er.role_id = r.id
        LEFT JOIN employee_employment_status ees ON ees.employee_id = e.id
        LEFT JOIN employment_status es ON  es.id = ees.status_id
        LEFT JOIN department_position dp ON e.position_id = dp.id
        LEFT JOIN departments d ON dp.department_id = d.id
        LEFT JOIN positions p ON dp.position_id = p.id
        WHERE e.id = ?
    `, [id]);

    return rows[0]; 
}
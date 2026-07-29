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

/**
 * Find position by id
 * @param {Number} position_id - The position ID
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Object>} - The position object found
 */
exports.find_position_by_id = async (position_id, connection = pool) => {
    const [rows] = await connection.execute('SELECT position_code FROM positions WHERE id = ?', [position_id]);
    return rows[0];
};

/**
 * Get max department sequence
 * @param {Number} department_id - The department ID
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Number>} - The max sequence number
 */
exports.get_max_department_sequence = async (department_id, connection = pool) => {
    const [rows] = await connection.execute('SELECT MAX(department_sequence_join) as max_seq FROM employers WHERE department_id = ?', [department_id]);
    return rows[0].max_seq;
};

/**
 * Get max position sequence
 * @param {Number} position_id - The position ID
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Number>} - The max sequence number
 */
exports.get_max_position_sequence = async (position_id, connection = pool) => {
    const [rows] = await connection.execute('SELECT MAX(position_sequence_join) as max_seq FROM employers WHERE position_id = ?', [position_id]);
    return rows[0].max_seq;
};

/**
 * Find user by employee code
 * @param {String} employee_code - The employee code
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Object>} - The user object found
 */
exports.find_user_by_employee_code = async (employee_code, connection = pool) => {
    const [rows] = await connection.execute(`SELECT employee_code FROM employers WHERE employee_code = ?`, [employee_code]);
    return rows[0];
};

/**
 * Add a new employee
 * @param {Object} employeeData - The employee data
 * @param {Object} [connection=pool] - The database connection object
 */
exports.add_employee = async (employeeData, connection = pool) => {
    const {
        employee_code, department_sequence_join, position_sequence_join,
        name, gender, address, date_of_birth, email, telephone_number,
        bank_name, account_number, join_date, department_id, position_id,
        employement_status, ptkp_status, password
    } = employeeData;

    await connection.execute(`
        INSERT INTO employers(
            employee_code, department_sequence_join, 
            position_sequence_join, name, gender, address, date_of_birth, 
            email, telephone_number, bank_name, account_number, join_date, 
            department_id, position_id, employement_status, ptkp_status, password
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        employee_code, department_sequence_join,
        position_sequence_join, name, gender, address, date_of_birth,
        email, telephone_number, bank_name, account_number, join_date,
        department_id, position_id, employement_status, ptkp_status, password
    ]);
};
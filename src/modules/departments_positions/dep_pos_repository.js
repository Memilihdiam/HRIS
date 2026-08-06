const pool = require('../../config/db');
const { HTTP_STATUS } = require('../../utils/util');

/**
 * 
 * @param {String} connection - Connection pool
 * @returns {Promise<Object>} - All department data
 */
exports.find_departments = async () => {
    const [rows] = await pool.execute('SELECT * FROM departments');
    return rows;
}

/**
 * 
 * @param {String} connection - Connection pool
 * @returns {Promise<Object>} - All position data
 */
exports.find_positions = async () => {
    const [rows] = await pool.execute('SELECT * FROM positions');
    return rows;
}

/**
 * find a department by id
 * @param {String} id - The department id
 * @return {Promise<Object>} - The department data
 */
exports.find_department_by_id = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM departments WHERE id = ?', [id]);
    return rows[0];
}

/**
 * find a position by id
 * @param {String} id - The position id
 * @returns {Promise<Object>} - The position data
 */ 
exports.find_position_by_id = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM positions WHERE id = ?', [id]);
    return rows[0];
}

/**
 * add a new department
 * @param {String} department_name - The name for department
 * @param {String} department_code - The code for department
 */
exports.create_departments = async (department_name, department_code) => {
    await pool.execute('INSERT INTO departments (department_name, department_code) VALUES (?, ?)', [department_name, department_code]);
}

/**
 * add a new position
 * @param {String} position_name - The name for position
 * @param {String} position_code - The code for position
 * @param {String} level - The level of position
 */
exports.create_positions = async (position_name, position_code, level) => {
    await pool.execute('INSERT INTO positions (position_name, position_code, level) VALUES (?, ?, ?)', [position_name, department_code, level]);
}

/**
 * add a job position
 * @param {String} connection - The connection from pool database
 * @param {String} department_id - From department id
 * @param {String} position_id - From position id 
 * @param {String} position_name - Combined from department name + position name
 * @param {String} position_code - Combined from department code + position code
 * @param {String} basic_salary - The salary for job
 * @param {String} allowance - The allowance for job
 */
exports.create_department_position = async (connection, department_id, position_id, position_name, position_code, basic_salary, allowance) => {
    await pool.execute('INSERT INTO department_position (department_id, position_id, position_name, position_code, basic_salary, allowance) VALUE (?, ?, ?, ?, ?, ?)',
        [department_id, position_id, position_name, position_code, basic_salary, allowance]
    );
}

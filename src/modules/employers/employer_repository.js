const pool = require('../../config/db');

/**
 * Get all employee
 * @param {String} connection - Connection database pool variable
 * @return {Promise<Object>} - The employees object found
 */
exports.all_employees_data = async(connection = pool) => {
    const [rows] = await connection.execute(`
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
    `);
    return rows;
}

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
    const [rows] = await connection.execute(`
        SELECT MAX(e.department_sequence_join) as max_seq 
        FROM employees e
        JOIN department_position dp ON e.position_id = dp.id
        WHERE dp.department_id = ?
    `, [department_id]);
    return rows[0].max_seq;
};

/**
 * Get max position sequence
 * @param {Number} position_id - The position ID from department_position table
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Number>} - The max sequence number
 */
exports.get_max_position_sequence = async (position_id, connection = pool) => {
    const [rows] = await connection.execute(`
        SELECT MAX(e.position_sequence_join) as max_seq 
        FROM employees e
        JOIN department_position dp ON e.position_id = dp.id
        WHERE dp.id = ?
    `, [position_id]);
    return rows[0].max_seq;
};

/**
 * Find user by employee code
 * @param {String} employee_code - The employee code
 * @param {Object} [connection=pool] - The database connection object
 * @return {Promise<Object>} - The user object found
 */
exports.find_user_by_employee_code = async (employee_code, connection = pool) => {
    const [rows] = await connection.execute(`SELECT employee_code FROM employees WHERE employee_code = ?`, [employee_code]);
    return rows[0];
};

/**
 * Add a new employee
 * @param {Object} employeeData - The employee data
 * @param {Object} [connection=pool] - The database connection object
 */
exports.add_employee = async (employeeData, connection = pool) => {
    const {
        employee_code,
        department_sequence_join, position_sequence_join, name, gender, address, date_of_birth, email, telephone_number,
        bank_name, account_number, join_date, department_id, position_id,
        employement_status, password
    } = employeeData;

    // 1. Insert data ke tabel employees dan dapatkan hasilnya
    const [result] = await connection.execute(`
        INSERT INTO employees(
            employee_code, department_sequence_join, position_sequence_join, name, gender, address, date_of_birth, 
            email, telephone_number, bank_name, account_number, 
            join_date, position_id, password
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        employee_code, department_sequence_join, position_sequence_join, name, gender, address, date_of_birth,
        email, telephone_number, bank_name, account_number, join_date, 
        position_id, password
    ]);

    // 2. Ambil ID dari karyawan yang baru saja dibuat
    const newEmployeeId = result.insertId;

    // 3. Insert data ke tabel relasi employees_employment_status
    await connection.execute(`
        INSERT INTO employee_employment_status(status_id, employee_id, start_work)
        VALUES (?, ?, ?)
    `, [employement_status, newEmployeeId, join_date]);
};
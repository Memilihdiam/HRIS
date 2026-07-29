const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { HTTP_STATUS } = require('../utils/util');
const { employer_code_gen } = require('../utils/employer_code_generator');
const auth_repository = require('../repository/auth_repository');

/**
 * Authentication user and return a jwt token
 * @param {String} employee_code - The user code
 * @param {String} password - The user password
 * @returns {Promise<String>} - Return token jwt for auth
 * @throws {Error} - If authentication error
 */
exports.login_user = async (employee_code, password) => {
    if(!employee_code || !password){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    };

    const user = await auth_repository.find_user_for_login(employee_code, password);
    if(user.length === 0){
        const error = new Error("User Not Found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    };

    const validation_password = await bcrypt.compare(password, user.password);
    if(!validation_password){
        const error = new Error("Invalid Password");
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw error;
    };

    const token = jwt.sign(
        {
            id: user.id, 
            employee_code: user.employee_code, 
            position: user.position_code, 
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1D'}
    )

    return {token}
}

/**
 * Register a new employee
 * @param {Object} employeeData - The employee data from request
 * @returns {Promise<Object>} - The new employee object
 * @throws {Error} - If registration fails
 */
exports.register_user = async (employeeData) => {
    const { name, gender, address, date_of_birth, email, telephone_number, bank_name, account_number, join_date, department_id, position_id, employement_status, ptkp_status, password } = employeeData;

    // 1. Validasi input
    if(!name || !gender || !address || !date_of_birth || !email || !telephone_number || !bank_name || !account_number || !join_date || !department_id || !position_id || !employement_status || !ptkp_status || !password ){
        const error = new Error("Field Can't Be Null!");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    };

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 2. Dapatkan position_code
        const position = await auth_repository.find_position_by_id(position_id, connection);
        if (!position) {
            const error = new Error('Invalid Position ID');
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }
        const position_code = position.position_code;

        // 3. Dapatkan sequence berikutnya
        const maxDeptSeq = await auth_repository.get_max_department_sequence(department_id, connection);
        const nextDeptSeq = (maxDeptSeq || 0) + 1;

        const maxPosSeq = await auth_repository.get_max_position_sequence(position_id, connection);
        const nextPosSeq = (maxPosSeq || 0) + 1;

        // 4. Generate employee_code
        const employee_code = employer_code_gen(position_code, nextDeptSeq, nextPosSeq);

        // 5. Cek apakah employee_code sudah ada
        const existingEmployee = await auth_repository.find_user_by_employee_code(employee_code, connection);
        if (existingEmployee) {
            const error = new Error('Employee Code already exists');
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 6. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Siapkan data untuk dimasukkan ke database
        const newEmployeeData = {
            ...employeeData,
            employee_code,
            position_code,
            department_sequence_join: nextDeptSeq,
            position_sequence_join: nextPosSeq,
            password: hashedPassword
        };

        // 8. Insert employee baru
        await auth_repository.add_employee(newEmployeeData, connection);

        await connection.commit();
        return { employee_code, name, email };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err; // Lemparkan error ke controller
    } finally {
        if (connection) connection.release();
    }
}
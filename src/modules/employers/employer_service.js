const redisClient = require('../../config/redis');
const pool = require('../../config/db');
const { HTTP_STATUS } = require('../../utils/util');
const employer_repository = require('./employer_repository');
const { employer_code_gen } = require('../../utils/employer_code_generator');
const bcrypt = require('bcrypt');

/**
 * Register a new employee
 * @param {Object} employeeData - The employee data from request
 * @returns {Promise<Object>} - The new employee object
 * @throws {Error} - If registration fails
 */
exports.register_user = async (employeeData) => {
    const { name, gender, address, date_of_birth, email, telephone_number, bank_name, account_number, join_date, position_id, employement_status, password } = employeeData;

    // 1. Validasi input
    if(!name || !gender || !address || !date_of_birth || !email || !telephone_number || !bank_name || !account_number || !join_date || !position_id || !employement_status || !password ){
        const error = new Error("Field Can't Be Null!");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    };

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 2. Dapatkan tahun masuk
        const year = new Date().getFullYear();
        const code = parseInt(year) - 2000;

        // 3. Dapatkan sequence berikutnya
        const maxDeptSeq = await employer_repository.get_max_department_sequence(position_id, connection);
        const nextDeptSeq = (maxDeptSeq || 0) + 1;

        const maxPosSeq = await employer_repository.get_max_position_sequence(position_id, connection);
        const nextPosSeq = (maxPosSeq || 0) + 1;

        // 4. Generate employee_code
        const employee_code = employer_code_gen(code, nextDeptSeq, nextPosSeq);

        // 5. Cek apakah employee_code sudah ada
        const existingEmployee = await employer_repository.find_user_by_employee_code(employee_code, connection);
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
            department_sequence_join: nextDeptSeq,
            position_sequence_join: nextPosSeq,
            password: hashedPassword
        };

        // 8. Insert employee baru
        await employer_repository.add_employee(newEmployeeData, connection);

        await connection.commit();
        return { employee_code, name, email };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err; // Lemparkan error ke controller
    } finally {
        if (connection) connection.release();
    }
}

/**
 * Employees list data
 * @return {Promise<Object>} - All employee list object
 * @throws {Error} - If fails fetch data
 */
exports.employees_list = async () => {
    let connection;
    const cacheKey = `employees:list`
    const CACHE_EXPIRATION = 3600;
    
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData){
            return { list: JSON.parse(cachedData) };
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const list = await employer_repository.all_employees_data(connection);
        
        await redisClient.set(cacheKey, JSON.stringify(list), 'EX', CACHE_EXPIRATION);
        await connection.commit();

        return { list };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}
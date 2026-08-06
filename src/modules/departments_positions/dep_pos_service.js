const pool = require('../../config/db');
const dep_pos_repository = require('./dep_pos_repository');
const redisClient = require('../../config/redis');
const { HTTP_STATUS } = require('../../utils/util');

/**
 * 
 * @param {String} department_id - The input department id
 * @param {String} position_id - The input department id
 * @param {String} basic_salary - The input basic salary for job
 * @param {String} allowance - The input allowance for job
 */
exports.department_position = async (department_id, position_id, basic_salary, allowance) => {
    if(!department_id || !position_id|| !basic_salary || !allowance){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const department = await dep_pos_repository.find_department_by_id(department_id);
        const position = await dep_pos_repository.find_position_by_id(position_id);
    
        const department_code = department.department_code;
        const position_code = position.position_code;
    
        const department_name = department.department_name;
        const position_name = position.position_name;
    
        const job_code = department_code + position_code;
        const job_name = department_name + position_name;
    
        await dep_pos_repository.create_department_position(connection, department_id, position_id, job_name, job_code, basic_salary, allowance);

        await connection.commit();

        const cacheRedis = ['all-departments', 'all-positions'];
        await redisClient.del(cacheRedis);
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.get_all_departments = async () => {
    const cachedKey = 'all-departments';
    const CACHE_EXPIRATION = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { departments: JSON.parse(cacheData) };
        }

        const departments = await dep_pos_repository.find_departments();
        if(departments.length === 0){
            return { departments: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(departments), 'EX', CACHE_EXPIRATION);

        return { departments };
    }catch(err){
        throw err;
    }
}

exports.get_all_positions = async () => {
    const cachedKey = 'all-positions';
    const CACHE_EXPIRATION = 3600;
    
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { positions: JSON.parse(cacheData) };
        }

        const positions = await dep_pos_repository.find_positions();
        if(positions.length === 0){
            return { positions: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(positions), 'EX', CACHE_EXPIRATION);

        return { positions };
    }catch(err){
        throw err;
    }
}

exports.find_department = async (id) => {
    if(!id){
        const error = new Error("Send the ID");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }
    const cachedKey = `department:${id}`;
    const CACHE_EXPIRATION = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { department: JSON.parse(cacheData)};
        }

        const department = await dep_pos_repository.find_department_by_id(id);

        if(!department){
            const error = new Error("Department Not Found");
            error.statusCode = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        await redisClient.set(cachedKey, JSON.stringify(department), 'EX', CACHE_EXPIRATION);

        return { department };
    }catch(err){
        throw err;
    }
}

exports.find_position = async (id) => {
    if(!id){
        const error = new Error("Send The Position ID");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }
}
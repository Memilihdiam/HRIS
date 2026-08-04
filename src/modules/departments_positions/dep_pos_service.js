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
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
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

    let connection;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { department: JSON.parse(cacheData)};
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const department = await dep_pos_repository.find_department_by_id(connection, id);

        if(!department){
            const error = new Error("Department Not Found");
            error.statusCode = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        await redisClient.set(cachedKey, JSON.stringify(department), 'EX', CACHE_EXPIRATION);
        await connection.commit();

        return { department };
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.find_position = async (id) => {
    if(!id){
        const error = new Error("Send The Position ID");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }
}
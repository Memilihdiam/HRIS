const pool = require('../../config/db');
const redisClient = require('../../config/redis');
const { HTTP_STATUS } = require('../../utils/util');
const role_repository = require('./role_repository');

exports.get_roles = async () => {
    const cachedKey = 'roles';
    const CACHE_EXPIRATION = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { roles : JSON.parse(cacheData) }
        }

        const roles = await role_repository.fetch_role();
        if(roles.length === 0){
            return { roles: [] }
        }

        await redisClient.set(cachedKey, JSON.stringify(roles), 'EX', CACHE_EXPIRATION);

        return { roles };
    }catch(err){
        throw err;
    }
}

exports.get_permissions = async () => {
    const cachedKey = 'permissions';
    const CACHE_EXPIRATION = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { permissions : JSON.parse(cacheData) }
        }

        const permissions = await role_repository.fetch_permission();
        if(permissions.length === 0){
            return { permissions: [] }
        }

        await redisClient.set(cachedKey, JSON.stringify(permissions), 'EX', CACHE_EXPIRATION);

        return { permissions };
    }catch(err){
        throw err;
    }
}

exports.get_role_permissions = async () => {
    const cachedKey = 'role-permissions';
    const CACHE_EXPIRATION = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { role_permissions : JSON.parse(cacheData) }
        }

        const role_permissions = await role_repository.fetch_role_permission();
        if(role_permissions.length === 0){
            return { role_permissions: [] }
        }

        await redisClient.set(cachedKey, JSON.stringify(role_permissions), 'EX', CACHE_EXPIRATION);

        return { role_permissions };
    }catch(err){
        throw err;
    }
}

exports.add_role = async (data) => {
    const {role_name, description} = data;
    if(!role_name || !description){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await role_repository.add_role(role_name, description, connection);

        await connection.commit();
        await redisClient.del('role-permissions');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.add_permission = async (data) => {
    const { module_name, permission_name, description } = data;
    if(!module_name || !permission_name || !description){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }
    
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await role_repository.add_permission(module_name, permission_name, description, connection);

        await connection.commit();
        await redisClient.del('role-permissions');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.add_role_permission = async (data) => {
    const { role_id, permission_id } = data;
    if(!role_id || !permission_id){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await role_repository.add_role_permission(role_id, permission_id, connection);

        await connection.commit();
        await redisClient.del('role-permissions');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.add_employee_role = async (data) => {
    const { employee_id, role_id } = data;
    if(!employee_id || !role_id){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await role_repository.add_employee_role(employee_id, role_id, connection);

        await connection.commit();
        await redisClient.del('employee-role');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}
const pool = require("../../config/db");
const redisClient = require("../../config/redis");
const { HTTP_STATUS } = require("../../utils/util");
const client_repository = require('./client_repository');

exports.fetch_all_clients = async () => {
    const cachedKey = 'all-clients';
    const CACHE_EXPIRATION = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { clients: JSON.parse(cacheData) };
        }

        const clients = await client_repository.fetch_all_clients();
        if(clients.length === 0){
            return { clients : [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(clients), 'EX', CACHE_EXPIRATION);

        return { clients };

    }catch(err){
        throw err;
    }
}

exports.add_client = async (client_data) => {
    const { client_code, company_name, industry_id, pic_name, email, telephone_number, address, status } = client_data;
    if(!client_code || !company_name || !industry_id || !pic_name || !email || !telephone_number || !address || !status){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await client_repository.add_client(client_data, connection);

        await connection.commit();

        await redisClient.del('all-clients')
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}
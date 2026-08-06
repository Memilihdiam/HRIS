const pool = require('../../config/db');
const redisClient = require('../../config/redis');
const { HTTP_STATUS } = require('../../utils/util');
const vendor_repository = require('./vendor_repository');

exports.add_vendors = async (vendor_data, id) => {
    const  { vendor_code, company_name, pic_name, email, telephone_number, address, npwp, rating, status } = vendor_data;
    if(!vendor_code || !company_name || !pic_name || !email || !telephone_number || !address || !npwp || !rating || !rating || !status ){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const new_vendor_data = {
            ...vendor_data,
            created_by: id
        }

        await vendor_repository.add_vendors(new_vendor_data, connection);

        await connection.commit();

    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.find_vendors = async () => {
    const cachedKey = 'vendors';
    const CACHE_EXPIRATION = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { vendors: JSON.parse(cacheData) };
        }

        const vendors = await vendor_repository.find_all_vendors();
        if(vendors.length === 0){
            return { vendors: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(vendors), 'EX', CACHE_EXPIRATION);

        return { vendors };
    }catch(err){
        throw err;
    }
}
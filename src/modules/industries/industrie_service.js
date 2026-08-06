const redisClient = require('../../config/redis');
const industrie_repository = require('./industrie_repository');

exports.fetch_industry = async () => {
    const cachedKey = 'all-industry';
    const CACHE_EXPIRATION = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { industries : JSON.parse(cacheData) };
        }

        const industries = await industrie_repository.fetch_industries();
        if(industries.length === 0){
            return { industries: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(industries), 'EX', CACHE_EXPIRATION);

        return { industries };

    }catch(err){
        throw err;
    }
}
const { HTTP_STATUS } = require('../../utils/util');
const user_repository = require('./user_repository');
const redisClient = require('../../config/redis');

exports.user_data_service = async (id) => {
    const cacheKey = `user:${id}`;
    const CACHE_EXPIRATION = 3600;

    try {
        // Cek redis cache data
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) {
            return { user: JSON.parse(cachedUser) };
        }

        const user = await user_repository.find_user_by_id(id);

        if (!user) {
            const error = new Error("User Not Found");
            error.statusCode = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Simpan data ke Redis dengan waktu kedaluwarsa
        await redisClient.set(cacheKey, JSON.stringify(user), 'EX', CACHE_EXPIRATION);

        return { user };
    } catch (err) {
        console.error('Error in user_data_service:', err);
        throw err;
    }
};
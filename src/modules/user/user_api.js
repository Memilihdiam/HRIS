const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const user_controller = require('./user_controller');

/**
 * Api for get user data
 * @return {Promise<Object>} - The user data based on redis session
 */
route.get('/me', verifyToken, user_controller.get_user_data);

module.exports = route;

const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const client_controller = require('./client_controller');

/**
 * Api fetch all client data
 * @returns {Promise<Object>} - All client data
 */
route.get('/', verifyToken, client_controller.fetch_all_client);

/**
 * Api add clients
 * @param {String} client_data - Client data for added
 */
route.post('/', verifyToken, client_controller.add_client);

module.exports = route;
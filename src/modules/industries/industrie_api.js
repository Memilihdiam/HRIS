const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const industrie_controller = require('./industrie_controller');

route.get('/', verifyToken, industrie_controller.fetch_industries);

module.exports = route;
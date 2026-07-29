const route = require('express').Router();
const auth_controller = require('../controllers/auth_controller');
const { verifyToken } = require('../middlewares/middleware');

route.post('/login', auth_controller.login);
route.post('/register', verifyToken, auth_controller.register);

module.exports = route;
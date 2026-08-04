const route = require('express').Router();
const auth_controller = require('../modules/authentication/auth_controller');
const user_controller = require('../modules/user/user_controller');
const employer_controller = require('../modules/employers/employer_controller');
const { verifyToken } = require('../middlewares/middleware');

route.post('/login', auth_controller.login);

route.get('/me', verifyToken, user_controller.get_user_data);

route.post('/register', verifyToken, employer_controller.register);
route.get('/employees', verifyToken, employer_controller.employee_list);

module.exports = route;
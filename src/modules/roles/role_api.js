const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const role_controller = require('./role_controller');

route.get('/role', verifyToken, role_controller.fetch_all_roles);
route.get('/permission', verifyToken, role_controller.fetch_all_permissions);
route.get('/role/permission', verifyToken, role_controller.fetch_all_role_permissions);
route.post('/add/role', verifyToken, role_controller.add_role);
route.post('/add/permission', verifyToken, role_controller.add_permissions);
route.post('/add/role/permission', verifyToken, role_controller.add_role_permission);
route.post('/add/user/role', verifyToken, role_controller.add_employee_role);

module.exports = route;
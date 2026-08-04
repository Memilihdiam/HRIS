const route = require('express').Router();
const auth_controller = require('../modules/authentication/auth_controller');
const user_controller = require('../modules/user/user_controller');
const employer_controller = require('../modules/employers/employer_controller');
const { verifyToken } = require('../middlewares/middleware');
const dep_pos_controller = require('../modules/departments_positions/dep_pos_controller');

/**
 * Api for login
 * @param {String} employee_code - The unique code from employee
 * @param {String} password - The password for account employee
 */
route.post('/login', auth_controller.login);

/**
 * Api for get user data
 * @return {Promise<Object>} - The user data based on redis session
 */
route.get('/me', verifyToken, user_controller.get_user_data);

/**
 * API for add new employee
 * @param {String} employeeData - The data employee inside array
 */
route.post('/register', verifyToken, employer_controller.register);

/**
 * Api for get all employee list
 * @return {Promise<Object>} - The array list employee data
 */
route.get('/employees', verifyToken, employer_controller.employee_list);

/**
 * Api for add new job position
 * @param {String} department_id - The department id where job had
 * @param {String} position_id - The position id will adding
 * @param {String} basic_salary - The salary for a job
 * @param {String} allowance - The allowance for a job
 */
route.post('/job', verifyToken, dep_pos_controller.job_controller);
route.get('/department/:id', verifyToken, dep_pos_controller.find_department);

module.exports = route;
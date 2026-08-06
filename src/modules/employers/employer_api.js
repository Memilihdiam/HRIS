const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const employer_controller = require('./employer_controller');

/**
 * API for add new employee
 * @param {String} employeeData - The data employee inside array
 */
route.post('/', verifyToken, employer_controller.register);

/**
 * Api for get all employee list
 * @return {Promise<Object>} - The array list employee data
 */
route.get('/', verifyToken, employer_controller.employee_list);

module.exports = route;
const route = require('express').Router();
const auth_controller = require('./auth_controller');

/**
 * Api for login
 * @param {String} employee_code - The unique code from employee
 * @param {String} password - The password for account employee
 */
route.post('/', auth_controller.login);

module.exports = route;
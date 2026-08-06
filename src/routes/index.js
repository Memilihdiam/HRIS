const route = require('express').Router();

const auth = require('../modules/authentication/auth_api');
const dep_pos = require('../modules/departments_positions/dep_pos_api');
const employee = require('../modules/employers/employer_api');
const user = require('../modules/user/user_api');

route.use('/auth', auth);
route.use('/jobs', dep_pos);
route.use('/employees', employee);
route.use('/users', user);

module.exports = route;
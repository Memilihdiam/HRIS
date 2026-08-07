const route = require('express').Router();

const auth = require('../modules/authentication/auth_api');
const roles = require('../modules/roles/role_api');
const dep_pos = require('../modules/departments_positions/dep_pos_api');
const employee = require('../modules/employers/employer_api');
const user = require('../modules/user/user_api');
const vendor = require('../modules/vendors/vendor_api');
const client = require('../modules/clients/client_api');
const industry = require('../modules/industries/industrie_api');

route.use('/auth', auth);
route.use('/roles', roles);
route.use('/jobs', dep_pos);
route.use('/employees', employee);
route.use('/users', user);
route.use('/vendors', vendor);
route.use('/clients', client);
route.use('/industries', industry)

module.exports = route;
const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const vendor_controller = require('./vendor_controller');

/**
 * Api for find all vendors
 * @return {Promise<Object>} - All data vendors list
 */
route.get('/', verifyToken, vendor_controller.find_vendors);

/**
 * Api for add new vendor
 * @param {String} vendor_data - The data vendor inside array
 * @param {String} id - The user id from who is creating
 */
route.post('/', verifyToken, vendor_controller.add_vendor);

module.exports = route;
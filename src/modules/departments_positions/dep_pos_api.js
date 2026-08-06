const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const dep_pos_controller = require('./dep_pos_controller');

/**
 * Api for fetch all job
 * @returns {Promise<Object>} - The departments and positions data
 */
route.get('/', verifyToken, dep_pos_controller.fetch_all_job);

/**
 * Api for add new job position
 * @param {String} department_id - The department id where job had
 * @param {String} position_id - The position id will adding
 * @param {String} basic_salary - The salary for a job
 * @param {String} allowance - The allowance for a job
 */
route.post('/', verifyToken, dep_pos_controller.job_controller);

/**
 * Api for fetch department by id
 * @param {String} id - The department id to find
 * @returns {Promise<Object>} - The department data find by user
 */
route.get('/:id', verifyToken, dep_pos_controller.find_department);

module.exports = route;
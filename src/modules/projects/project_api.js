const route = require('express').Router();
const { verifyToken } = require('../../middlewares/middleware');
const project_controller = require('./project_controller');

/**
 * Api for finding all master projects
 * @return {Promise<Object>} - All projects list
 */
route.get('/', verifyToken, project_controller.find_projects);

/**
 * Api for finding a specific project by ID (includes budget, tasks, and milestones)
 * @param {String} id - The project ID
 * @return {Promise<Object>} - Detailed project data
 */
route.get('/:id', verifyToken, project_controller.find_project_by_id);

/**
 * Api for adding a new master project
 * @param {Object} project_data - The data of the project
 * @param {String} id - The user id from who is creating (from token)
 */
route.post('/', verifyToken, project_controller.add_project);

/**
 * Api for updating an existing project
 * @param {Object} project_data - The data of the project to update
 * @param {String} id - The project ID (from params)
 */
route.put('/:id', verifyToken, project_controller.update_project);

module.exports = route;
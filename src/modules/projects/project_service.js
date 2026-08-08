const pool = require('../../config/db');
const redisClient = require('../../config/redis');
const { HTTP_STATUS } = require('../../utils/util');
const project_repository = require('./project_repository');

const CACHE_KEY_PROJECTS = 'projects_list';
const CACHE_EXPIRATION = 3600; // 1 hour

exports.add_project = async (project_data, user_id) => {
    const { project_code, project_name, client_id, start_date, end_date, contract_value, status } = project_data;
    
    // Basic Validation
    if (!project_code || !project_name || !client_id || !start_date || !end_date || contract_value === undefined || !status) {
        const error = new Error("Project Fields Cannot Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await project_repository.add_project(project_data, connection);

        await connection.commit();

        // Invalidate cache
        await redisClient.del(CACHE_KEY_PROJECTS);
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

exports.update_project = async (project_id, project_data) => {
    if (!project_id) {
        const error = new Error("Project ID is required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await project_repository.update_project(project_id, project_data, connection);

        await connection.commit();

        // Invalidate caches
        await redisClient.del(CACHE_KEY_PROJECTS);
        await redisClient.del(`project_details_${project_id}`);
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

exports.find_projects = async () => {
    try {
        const cacheData = await redisClient.get(CACHE_KEY_PROJECTS);
        if (cacheData) {
            return { projects: JSON.parse(cacheData) };
        }

        const projects = await project_repository.find_all_projects();
        if (projects.length === 0) {
            return { projects: [] };
        }

        await redisClient.set(CACHE_KEY_PROJECTS, JSON.stringify(projects), 'EX', CACHE_EXPIRATION);

        return { projects };
    } catch (err) {
        throw err;
    }
}

exports.find_project_by_id = async (project_id) => {
    const specificCacheKey = `project_details_${project_id}`;
    
    try {
        const cacheData = await redisClient.get(specificCacheKey);
        if (cacheData) {
            return JSON.parse(cacheData);
        }

        // Fetch master data
        const project = await project_repository.find_project_by_id(project_id);
        
        if (!project || project.length === 0) {
            return { project: null, details: null };
        }

        // Fetch related module data (Budget, Tasks, Timeline, Procurement)
        const [budgets, tasks, milestones, team_members] = await Promise.all([
            project_repository.find_project_budgets(project_id),
            project_repository.find_project_tasks(project_id),
            project_repository.find_project_milestones(project_id),
            project_repository.find_project_teams(project_id)
        ]);

        const result = { 
            project: project[0], 
            details: {
                budgets,
                tasks,
                milestones,
                team_members
            }
        };

        // Cache the specific project details
        await redisClient.set(specificCacheKey, JSON.stringify(result), 'EX', CACHE_EXPIRATION);

        return result;
    } catch (err) {
        throw err;
    }
}
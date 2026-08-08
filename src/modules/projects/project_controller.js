const { HTTP_STATUS } = require("../../utils/util");
const project_service = require("./project_service");

exports.add_project = async (req, res) => {
    const { id: user_id } = req.user; 
    try {
        const project_data = req.body;

        await project_service.add_project(project_data, user_id);

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Successfully Created Project"
        });
    } catch (err) {
        console.log('Error Add Project:', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}

exports.find_projects = async (req, res) => {
    try {
        const { projects } = await project_service.find_projects();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfully Fetched Projects',
            projects
        });
    } catch (err) {
        console.log('Error while fetching all projects:', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}

exports.find_project_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const { project, details } = await project_service.find_project_by_id(id);

        if (!project) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Project Not Found'
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfully Fetched Project Details',
            project,
            details
        });
    } catch (err) {
        console.log('Error while fetching project by id:', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}

exports.update_project = async (req, res) => {
    try {
        const { id: project_id } = req.params;
        const project_data = req.body;
        
        await project_service.update_project(project_id, project_data);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Successfully Updated Project"
        });
    } catch (err) {
        console.log('Error Update Project:', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}
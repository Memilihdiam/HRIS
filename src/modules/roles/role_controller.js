const { HTTP_STATUS } = require('../../utils/util');
const role_service = require('./role_service');

exports.fetch_all_roles = async (req, res) => {
    try{
        const { roles } = await role_service.get_roles();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Successfuly Fetch Data",
            roles
        })
    }catch(err){
        console.log('Error While Fetch Role, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.fetch_all_permissions = async (req, res) => {
    try{
        const { permissions } = await role_service.get_permissions();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Successfuly Fetch Data",
            permissions
        })
    }catch(err){
        console.log('Error While Fetch Permissions, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.fetch_all_role_permissions = async (req, res) => {
    try{
        const { role_permissions } = await role_service.get_role_permissions();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Successfuly Fetch Data",
            role_permissions
        })
    }catch(err){
        console.log('Error While Fetch Role Permissions, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.add_role = async (req, res) => {
    try{
        const data = req.body;

        await role_service.add_role(data);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Successfuly Add Role'
        })
    }catch(err){
        console.log('Error While Create Role, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.add_permissions = async (req, res) => {
    try{
        const data = req.body;

        await role_service.add_permission(data);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Successfuly Add Permission'
        })
    }catch(err){
        console.log('Error While Create Permission, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.add_role_permission = async (req, res) => {
    try{
        const data = req.body;

        await role_service.add_role_permission(data);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Successfuly Add Role Permission'
        })
    }catch(err){
        console.log('Error While Create Role Permission, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.add_employee_role = async (req, res) => {
    try{
        const data = req.body;

        await role_service.add_role(data);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Successfuly Add Employee Role'
        })
    }catch(err){
        console.log('Error While Add Employee Role, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}
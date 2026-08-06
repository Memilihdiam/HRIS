const { HTTP_STATUS } = require('../../utils/util');
const dep_pos_service = require('./dep_pos_service');

exports.job_controller = async (req, res) => {
    const { department_id, position_id, basic_salary, allowance} = req.body;
    try{
        await dep_pos_service.department_position(department_id, position_id, basic_salary, allowance);

        res.status(HTTP_STATUS.CREATED).json({
            success: true, 
            message: 'Successfuly Created New Job'
        })
    }catch(err){
        console.log('Error Creating a new job, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.fetch_all_job = async (req, res) => {
    try{
        const [departmentData, positionData] = await Promise.all([
            dep_pos_service.get_all_departments(),
            dep_pos_service.get_all_positions()
        ]);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch Data',
            departments: departmentData?.departments ?? [],
            positions: positionData?.positions ?? []
        })
    }catch(err){
        console.log('Error Fetch Job Data, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.find_department = async (req, res) => {
    const { id } = req.params;
    try{
        const { department } = await dep_pos_service.find_department(id);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch Data',
            department
        })
    }catch(err){
        console.log('Error Fetch Department, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}
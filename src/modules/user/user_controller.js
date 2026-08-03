const { HTTP_STATUS } = require('../../utils/util');
const user_service = require('./user_service');

exports.get_user_data = async (req, res) => {
    const { id } = req.user;
    try{
        const { user } = await user_service.user_data_service(id);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch User Data',
            user
        })
    }catch(err){
        console.log('Error get user data, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}
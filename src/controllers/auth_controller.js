const auth_service = require('../service/auth_service');
const { HTTP_STATUS } = require('../utils/util');

exports.login = async (req, res) => {
    const { employee_code, password } = req.body;
    try{
        const { token } = await auth_service.login_user(employee_code, password);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Auth Success'
        });
    }catch(err){
        console.log('Error login function, ', err);
        return res.status(HTTP_STATUS).json({
            success: false,
            message: 'Internal Server Error'
        });
    };
};
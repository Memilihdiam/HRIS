const auth_service = require('./auth_service');
const { HTTP_STATUS } = require('../../utils/util');

exports.login = async (req, res) => {
    const { employee_code, password } = req.body;
    try{
        // Memanggil service untuk mendapatkan token
        const { sessionId } = await auth_service.login_user(employee_code, password);

        // Set session ID in an HTTP-Only cookie
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        });

        // Mengirim response sukses
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Auth Success'
        });
    }catch(err){
        console.log('Error login function, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    };
};
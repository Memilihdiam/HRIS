const auth_service = require('../service/auth_service');
const { HTTP_STATUS } = require('../utils/util');

exports.login = async (req, res) => {
    const { employee_code, password } = req.body;
    try{
        // Memanggil service untuk mendapatkan token
        const { token } = await auth_service.login_user(employee_code, password);

        // Mengirim response sukses
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

exports.register = async (req, res) => {
    try {
        // Mengambil data dari body request
        const employeeData = req.body;

        // Memanggil service untuk menambahkan employee baru
        const newEmployee = await auth_service.register_user(employeeData);

        // Mengirim response sukses
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Successfully Add Employee",
            data: newEmployee
        });
    } catch (err) {
        console.log("Error saat register, ", err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};
const employer_service = require('./employer_service');
const { HTTP_STATUS } = require('../../utils/util');

exports.register = async (req, res) => {
    try{
        // Mengambil data dari body request
        const employeeData = req.body;

        // Memanggil service untuk menambahkan employee baru
        const newEmployee = await employer_service.register_user(employeeData);

        // Mengirim response sukses
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Successfully Add Employee",
            data: newEmployee
        });
    }catch(err) {
        console.log("Error register function, ", err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};

exports.employee_list = async (req, res) => {
    try{
        const { list } = await employer_service.employees_list();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Successfuly Fetch Data",
            list: list
        })
    }catch(err){
        console.log("Error employee list, ", err);
        return res.status(err.statusCode) || HTTP_STATUS.INTERNAL_SERVER_ERROR.json({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
}
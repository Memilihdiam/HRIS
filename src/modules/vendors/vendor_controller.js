const { HTTP_STATUS } = require("../../utils/util");
const vendor_service = require("./vendor_service");

exports.add_vendor = async (req, res) => {
    const { id } = req.user; 
    try{
        const vendor_data = req.body;

        await vendor_service.add_vendors(vendor_data, id);

        // Kirim response sukses
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Successfully Add Vendor",
        });
    }catch(err){
        console.log('Error Add Vendor', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
}

exports.find_vendors = async (req, res) => {
    try{
        const { vendors } = await vendor_service.find_vendors();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch Data',
            vendors
        })
    }catch(err){
        console.log('Error while fetch all vendor, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
    }
}
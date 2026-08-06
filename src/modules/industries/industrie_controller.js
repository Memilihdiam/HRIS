const { HTTP_STATUS } = require('../../utils/util');
const industrie_service = require('./industrie_service');

exports.fetch_industries = async (req, res) => {
    try{
        const { industries } = await industrie_service.fetch_industry();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch Data',
            industries
        })
    }catch(err){
        console.log('Error while fetch industrie, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}
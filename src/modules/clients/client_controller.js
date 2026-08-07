const { HTTP_STATUS } = require('../../utils/util');
const client_service = require('./client_service');

exports.fetch_all_client = async (req, res) => {
    try{
        const { clients } = await client_service.fetch_all_clients();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Fetch data',
            clients
        })
    }catch(err){
        console.log('Error while fetch client, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.add_client = async (req, res) => {
    const client_data = req.body;
    try{
        await client_service.add_client(client_data);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Successfuly Add Client'
        });
    }catch(err){
        console.log('Error while add client, ', err);
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}
const jwt = require('jsonwebtoken');
const { HTTP_STATUS } = require('../utils/util');

// Fungsi verifikasi token pengguna
const verifyToken = async(req, res, next) => {
    const header = req.headers['authorization'];
    if(!header){
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: 'Token Cannot Found'
        })
    }
    
    try{
        const token = header.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: 'Invalid Token'
        })
    }
}

module.exports = {verifyToken};
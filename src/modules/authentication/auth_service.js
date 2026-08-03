const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../../config/redis');
const { HTTP_STATUS } = require('../../utils/util');
const { employer_code_gen } = require('../../utils/employer_code_generator');
const auth_repository = require('./auth_repository');
const ONE_DAY = 60 * 60 * 24;

/**
 * Authentication user and return a jwt token
 * @param {String} employee_code - The user code
 * @param {String} password - The user password
 * @returns {Promise<String>} - Return token jwt for auth
 * @throws {Error} - If authentication error
 */
exports.login_user = async (employee_code, password) => {
    if(!employee_code || !password){
        const error = new Error("Field Can't Be Null");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    };

    const user = await auth_repository.find_user_for_login(employee_code, password);
    if(!user){
        const error = new Error("User Not Found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    };

    const validation_password = await bcrypt.compare(password, user.password);
    if(!validation_password){
        const error = new Error("Invalid Password");
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw error;
    };

    const sessionId = uuidv4();

    const token = jwt.sign(
        {
            id: user.id, 
            employee_code: user.employee_code, 
            position: user.position_code, 
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1D'}
    );

    // Store token in Redis with session ID as key
    await redisClient.set(`session:${sessionId}`, token, 'EX', ONE_DAY);

    return { sessionId };
};
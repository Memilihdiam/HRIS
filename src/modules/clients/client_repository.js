const pool = require('../../config/db');
const { HTTP_STATUS } = require('../../utils/util');

exports.fetch_all_clients = async () => {
    const [rows] = await pool.execute('SELECT * FROM clients');
    return rows;
}

exports.add_client = async (client_data, connection = pool) => {
    const { client_code, company_name, industry_id, pic_name, email, telephone_number, address, status } = client_data;
    await connection.execute(`
        INSERT INTO clients (client_code, company_name, industry_id, pic_name, email, telephone_number, address, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [client_code, company_name, industry_id, pic_name, email, telephone_number, address, status]
    );
}
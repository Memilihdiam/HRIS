const pool = require('../../config/db');
const { HTTP_STATUS } = require('../../utils/util');

exports.find_all_vendors = async() => {
    const [rows] = await pool.execute('SELECT * FROM vendors');
    return rows;
}

exports.find_vendors_by_id = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM vendors WHERE id = ?', [id]);
    return rows;
}

exports.add_vendors = async (vendor_data, connection = pool) => {
    const { vendor_code, company_name, pic_name, email, telephone_number, address, npwp, rating, status, created_by } = vendor_data;

    await connection.execute('INSERT INTO vendors (vendor_code, company_name, pic_name, email, telephone_number, address, npwp, rating, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [vendor_code, company_name, pic_name, email, telephone_number, address, npwp, rating, status, created_by]
    );
}
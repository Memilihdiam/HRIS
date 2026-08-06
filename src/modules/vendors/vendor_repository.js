const pool = require('../../config/db');
const { HTTP_STATUS } = require('../../utils/util');

exports.find_all_vendors = async() => {
    const query = `
        SELECT
            v.id,
            v.vendor_code, 
            v.company_name, 
            v.industry_id, 
            v.pic_name, 
            v.email, 
            v.telephone_number, 
            v.address, 
            v.npwp, 
            v.rating, 
            v.status, 
            v.created_by,
            v.created_at,
            v.updated_at,
            e.name AS created_name
        FROM vendors v
        LEFT JOIN employees e ON v.created_by = e.id
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

exports.find_vendors_by_id = async (id) => {
    const query = `
        SELECT
            v.id,
            v.vendor_code, 
            v.company_name, 
            v.industry_id, 
            v.pic_name, 
            v.email, 
            v.telephone_number, 
            v.address, 
            v.npwp, 
            v.rating, 
            v.status, 
            v.created_by,
            v.created_at,
            v.updated_at,
            e.name AS created_name
        FROM vendors v
        LEFT JOIN employees e ON v.created_by = e.id
        WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

exports.add_vendors = async (vendor_data, connection = pool) => {
    const { vendor_code, company_name, industry_id, pic_name, email, telephone_number, address, npwp, rating, status, created_by } = vendor_data;

    await connection.execute('INSERT INTO vendors (vendor_code, company_name, industry_id, pic_name, email, telephone_number, address, npwp, rating, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [vendor_code, company_name, industry_id, pic_name, email, telephone_number, address, npwp, rating, status, created_by]
    );
}
const pool = require('../../config/db');

exports.fetch_role = async () => {
    const [rows] = await pool.execute('SELECT * FROM roles');
    return rows;
}

exports.fetch_permission = async () => {
    const [rows] = await pool.execute('SELECT * FROM permissions');
    return rows;
}

exports.fetch_role_permission = async () => {
    const query = `
        SELECT
            rp.role_id,
            rp.permission_id,
            r.id AS roles_id,
            r.role_name,
            r.description,
            p.id AS permissions_id,
            p.module_name,
            p.permission_name,
            p.description AS permission_description
        FROM role_permissions rp
        LEFT JOIN roles r ON r.id = rp.role_id
        LEFT JOIN permissions p ON p.id = rp.permission_id
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

exports.add_role = async (role_name, description, connection = pool) => {
    await connection.execute('INSERT INTO roles (role_name, description) VALUES (?, ?)', [role_name, description]);
}

exports.add_permission = async (module_name, permission_name, description, connection = pool) => {
    await connection.execute('INSERT INTO permissions (module_name, permission_name, description) VALUES (?, ?, ?)', [module_name, permission_name, description]);
}

exports.add_role_permission = async (role_id, permission_id, connection = pool) => {
    await connection.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [role_id, permission_id]);
}

exports.add_employee_role = async (employee_id, role_id, connection = pool) => {
    await connection.execute('INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)', [employee_id, role_id]);
}
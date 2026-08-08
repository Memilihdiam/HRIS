const pool = require('../../config/db');

exports.find_all_projects = async () => {
    const query = `
        SELECT 
            p.id, 
            p.project_code, 
            p.project_name, 
            p.client_id, 
            c.company_name AS client_name,
            p.start_date, 
            p.end_date, 
            p.contract_value, 
            p.status, 
            p.created_at
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
        ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

exports.find_project_by_id = async (id) => {
    const query = `
        SELECT 
            p.id, 
            p.project_code, 
            p.project_name, 
            p.client_id, 
            c.company_name AS client_name,
            c.pic_name AS client_pic,
            p.start_date, 
            p.end_date, 
            p.contract_value, 
            p.status, 
            p.created_at
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

exports.add_project = async (project_data, connection = pool) => {
    const { project_code, project_name, client_id, start_date, end_date, contract_value, status } = project_data;
    
    const query = `
        INSERT INTO projects 
        (project_code, project_name, client_id, start_date, end_date, contract_value, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.execute(query, [
        project_code, project_name, client_id, start_date, end_date, contract_value, status
    ]);
    
    return result;
}

exports.update_project = async (id, project_data, connection = pool) => {
    const { project_code, project_name, client_id, start_date, end_date, contract_value, status } = project_data;
    
    const query = `
        UPDATE projects 
        SET project_code = ?, project_name = ?, client_id = ?, start_date = ?, end_date = ?, contract_value = ?, status = ?
        WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
        project_code, project_name, client_id, start_date, end_date, contract_value, status, id
    ]);
    
    return result;
}

exports.find_project_budgets = async (project_id) => {
    const query = `SELECT * FROM project_budgets WHERE project_id = ?`;
    const [rows] = await pool.execute(query, [project_id]);
    return rows;
}

exports.find_project_tasks = async (project_id) => {
    const query = `
        SELECT t.*, e.name as assigned_employee_name 
        FROM project_tasks t
        LEFT JOIN employees e ON t.assigned_to = e.id
        WHERE t.project_id = ?
        ORDER BY t.due_date ASC
    `;
    const [rows] = await pool.execute(query, [project_id]);
    return rows;
}

exports.find_project_milestones = async (project_id) => {
    const query = `SELECT * FROM project_milestones WHERE project_id = ? ORDER BY target_date ASC`;
    const [rows] = await pool.execute(query, [project_id]);
    return rows;
}

exports.find_project_teams = async (project_id) => {
    const query = `
        SELECT pt.*, t.team_name, t.team_code
        FROM project_teams pt
        JOIN teams t ON pt.team_id = t.id
        WHERE pt.project_id = ?
    `;
    const [rows] = await pool.execute(query, [project_id]);
    return rows;
}
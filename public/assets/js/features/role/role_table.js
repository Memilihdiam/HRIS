import { fetch_role_permission } from "./role_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const table_body = document.getElementById('table-body');

    async function render_table(){
        const data = await fetch_role_permission();
        const roles = data.role_permissions;
        let tableRowHTML = '';

        if(roles.length === 0){
            tableRowHTML = `<tr><td colspan="5">No Data Yet</td></tr>`;
        }else{
            let no = 0;
            roles.forEach(item => {
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.module_name}</td>
                        <td>${item.role_name}</td>
                        <td>${item.permission_name}</td>
                        <td>${item.permission_description}</td>
                    </tr>
                `;
            })
        }
        table_body.innerHTML = tableRowHTML;
    }

    render_table();
})
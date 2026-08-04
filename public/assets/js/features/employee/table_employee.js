import { fetch_employee_list } from "./employee_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const table_body = document.getElementById('table-body');

    async function render_table(){
        const data = await fetch_employee_list();
        console.log(data);
        let tableRowHTML = '';

        if(data.length === 0){
            tableRowHTML = `<tr><td colspan="14">No Data Yet</td></tr>`
        }else{
            let no = 1;
            const statusColor = {
                tetap: "badge text-bg-primary",
                kontrak: "badge text-bg-info",
                magang: "badge text-bg-success"
            }
            data.forEach(item => {
                const status = (item.employement_status).toLowerCase();
                const badgeStatus = statusColor[status];
                let genderColor = item.gender === "Male"
                    ? "badge text-bg-primary"
                    : "badge text-bg-danger";
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.employee_code}</td>
                        <td>${item.name}</td>
                        <td>${new Date(item.date_of_birth).toLocaleDateString('id-ID')}</td>
                        <td><span class="${genderColor}">${item.gender}</span></td>
                        <td>${item.address}</td>
                        <td>${item.email}</td>
                        <td>${item.telephone_number}</td>
                        <td>${item.department_name}</td>
                        <td>${item.position_name}</td>
                        <td><span class="${badgeStatus}">${item.employement_status}</span></td>
                        <td>${item.role_name}</td>
                        <td>
                            <button class="btn btn-danger"><i class="bi bi-trash-fill"></i></button>
                            <button class="btn btn-warning"><i class="bi bi-pencil-fill"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        table_body.innerHTML = tableRowHTML;
    }

    render_table();
})
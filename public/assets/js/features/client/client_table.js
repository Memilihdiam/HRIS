import { fetch_all_client } from "./client_data.js";
import { fetch_industry } from "../industry/industry_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const table_body = document.getElementById('table-body');

    async function render_table(){
        const data = await fetch_all_client();
        const clients = data.clients;

        let tableRowHTML = '';
        if(clients.length === 0){
            tableRowHTML = `<tr><td colspan="10" class="text-center">No Data Yet</td></tr>`;
        }else{
            const statusColor = {
                active: 'badge text-bg-success',
                inactive: 'badge text-bg-danger'
            }
            let no = 1;
            clients.forEach(item => {
                const status = (item.status).toLowerCase();
                const badgeClass = statusColor[status];
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.client_code}</td>
                        <td>${item.company_name}</td>
                        <td>${item.pic_name}</td>
                        <td>${item.email}</td>
                        <td>${item.telephone_number}</td>
                        <td>${item.address}</td>
                        <td><span class="${badgeClass}">${item.status}</span></td>
                        <td>${new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                        <td>${new Date(item.updated_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                `;
            })
        }
        table_body.innerHTML = tableRowHTML;
    }

    render_table();
})
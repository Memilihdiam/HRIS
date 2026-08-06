import { fetch_all_vendor } from "./vendor_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const table_body = document.getElementById('table-body');

    async function render_table(){
        const data = await fetch_all_vendor();
        const vendors = data.vendors;

        let tableRowHTML = '';
        if(vendors.length === 0){
            tableRowHTML = `<tr><td colspan="14" class="text-center">No Data Yet</td></tr>`;
        }else{
            let no = 1;
            vendors.forEach(item => {
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.vendor_code}</td>
                        <td>${item.company_name}</td>
                        <td>${item.pic_name}</td>
                        <td>${item.email}</td>
                        <td>${item.telephone_number}</td>
                        <td>${item.address}</td>
                        <td>${item.npwp}</td>
                        <td>${item.rating}</td>
                        <td>${item.status}</td>
                        <td>${item.created_by}</td>
                        <td>${item.created_at}</td>
                        <td>${item.updated_at}</td>
                    </tr>
                `;
            })
        }
        table_body.innerHTML = tableRowHTML;
    }

    render_table();
})
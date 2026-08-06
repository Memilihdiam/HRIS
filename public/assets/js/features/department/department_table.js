import { fetch_department_position_data } from "./department_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    async function department_table(){
        const data = await fetch_department_position_data();
        const departments = data.departments;
        const positions = data.positions;
        console.log(positions);

        let tableRowHTML = '';

        if(departments.length === 0){
            tableRowHTML = `<tr><td colspan="6" class="text-center">No Data Yet</td></tr>`;
        }else{
            let no = 1;
            departments.forEach(item => {
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.id}</td>
                        <td>${item.department_name}</td>
                        <td>${item.department_code}</td>
                        <td>${item.created_at}</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                `
            })
        }
        tableBody.innerHTML = tableRowHTML;
    }

    department_table();
})
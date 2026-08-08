import { api_endpoint, post } from "../../shared/api.js";
import { fetch_role_permission, fetch_permission, fetch_role } from "../role/role_data.js";
import { fetch_employee_list } from "./employee_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-form');
    const employees_input = document.getElementById('employees-input');
    const role_input = document.getElementById('role-input');

    async function render_employee_select(){
        const data = await fetch_employee_list();
        let employee_select = '';

        if(data.length === 0){
            employee_select = `<option>Select Employee</option>`
        }else{
            data.forEach(item => {
                employee_select += `
                    <option value="${item.id}">${item.name}</option>
                `
            })
        }

        employees_input.innerHTML = `
            <option>Select Employee</option>
            ${employee_select}
        `
    }

    async function render_role_select(){
        const result = await fetch_role();
        const data = result.roles;
        let role_select = '';

        if(data.length === 0){
            role_select = `<option>Select Role</option>`
        }else{
            data.forEach(item => {
                role_select += `
                    <option value="${item.id}">${item.role_name}</option>
                `
            })
        }

        role_input.innerHTML = `
            <option>Select Role</option>
            ${role_select}
        `
    }

    render_employee_select();
    render_role_select();

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const employee = employees_input.value;
        const role = role_input.value;

        try{
            const data = {employee_id: employee, role_id: role};
            const response = await post(api_endpoint.ADD_EMPLOYEE_ROLE, data);
            if(response.success){
                window.location.href = '../../../pages/employees/employee_list.html';
            }
        }catch(err){
            console.log(err);
            alert(err);
        }
    })
})
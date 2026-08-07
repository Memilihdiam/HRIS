import { post, api_endpoint } from "../../shared/api.js";
import { fetch_role, fetch_permission } from "./role_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-form');
    const role = document.getElementById('role-name-input');
    const permission = document.getElementById('permission-input');

    async function render_role_select(){
        const roles_data = await fetch_role();
        const roles = roles_data.roles;
        let role_select = '';
        
        if(roles.length === 0){
            role.innerHTML = `<option>Select Roles</option>`
        }else{
            roles.forEach(item => {
                role_select += `
                    <option value="${item.id}">${item.role_name}</option>
                `
            })
        }

        role.innerHTML = `
            <option>Select Roles</option>
            ${role_select}
        `

    }

    async function render_permission_select(){
        const permission_data = await fetch_permission();
        const permissions = permission_data.permissions;
        let permission_select = '';

        if(permissions.length === 0){
            permission_select = `<option>Select Permission</option>`
        }else{
            permissions.forEach(item => {
                permission_select += `
                    <option value="${item.id}">${item.permission_name}</option>
                `;
            })
        }

        permission.innerHTML = `
            <option>Select Permission</option>
            ${permission_select}
        `
    }

    render_role_select();
    render_permission_select();

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try{
            const data = {
                role_id: role.value,
                permission_id: permission.value
            }
    
            const response = await post(api_endpoint.ADD_ROLE_PERMISSION, data);
            if(response.success){
                window.location.href = './role.html';
            }
        }catch(err){
            console.log(err);
            alert(err);
        }
    })
})
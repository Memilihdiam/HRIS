import { post, api_endpoint } from "../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-form');

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try{
            const data = {
                module_name: document.getElementById('module-name-input').value,
                permission_name: document.getElementById('permission-name-input').value,
                description: document.getElementById('description-input').value
            }

            const response = await post(api_endpoint.ADDPERMISSION, data);
            if(response.success){
                alert(response.message);
                window.location.href = '../../../pages/roles/role.html';
            }
        }catch(err){
            console.log('Error', err);
            alert(err);
        }
    })
})
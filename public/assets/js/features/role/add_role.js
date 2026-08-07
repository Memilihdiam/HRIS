import { post, api_endpoint } from "../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-form');

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try{
            const data = {
                role_name: document.getElementById('role-name-input').value,
                description: document.getElementById('description-input').value
            }
        
            const response = await post(api_endpoint.ADDROLE, data);
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
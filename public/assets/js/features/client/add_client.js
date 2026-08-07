import { post, api_endpoint } from "../../shared/api.js";
import { fetch_industry } from "../industry/industry_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-form');
    const industrySelect = document.getElementById('industry-input');
    
    async function render_industry(){
        const data = await fetch_industry();
        const industry = data.industries;


        let industryHTML = '';
        if(industry.length === 0){
            industryHTML = `<option>Select Industry</option>`
        }else{
            industry.forEach(item => {
                industryHTML += `
                    <option value="${item.id}">${item.name}</option>
                `;
            })
        }
        industrySelect.innerHTML = `
            <option>Select Industry</option>
            ${industryHTML}
        `;
    }
    
    render_industry();

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const client_data = {
            client_code: document.getElementById('client-code-input').value,
            company_name: document.getElementById('company-name-input').value,
            industry_id: document.getElementById('industry-input').value,
            pic_name: document.getElementById('pic-name-input').value,
            email: document.getElementById('email-input').value,
            telephone_number: document.getElementById('telephone-number-input').value,
            address: document.getElementById('address-input').value,
            status: document.getElementById('status-input').value
        }

        try{
            const response = await post(api_endpoint.ADDCLIENT, client_data);
            if(response.success){
                window.location.href = '../../../pages/client.html';
            }
        }catch(err){
            console.log(err);
            alert(err);
        }

    })

})

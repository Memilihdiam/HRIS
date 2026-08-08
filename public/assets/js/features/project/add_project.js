import { post, api_endpoint } from "../../shared/api.js";
import { handleAuthError } from "../../shared/auth.js";
import { fetch_all_client } from "../client/client_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const add_form = document.getElementById('add-project-form');
    const client_select = document.getElementById('client-id-input');

    async function render_client_select() {
        try {
            const client_data = await fetch_all_client();
            const clients = client_data.clients;
            let client_options = '';

            if (clients && clients.length > 0) {
                clients.forEach(item => {
                    client_options += `<option value="${item.id}">${item.company_name}</option>`;
                });
            } else {
                client_select.disabled = true;
            }

            client_select.innerHTML += client_options;

        } catch (error) {
            handleAuthError(error);
            console.error('Failed to load clients:', error);
            alert('Failed to load client data. Please try again.');
        }
    }

    render_client_select();

    add_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const project_data = {
            project_code: document.getElementById('project-code-input').value,
            project_name: document.getElementById('project-name-input').value,
            client_id: document.getElementById('client-id-input').value,
            start_date: document.getElementById('start-date-input').value,
            end_date: document.getElementById('end-date-input').value,
            contract_value: document.getElementById('contract-value-input').value,
            status: document.getElementById('status-input').value,
        };

        // Validasi sederhana
        for (const key in project_data) {
            if (!project_data[key]) {
                alert(`Error: Field "${key.replace(/_/g, ' ')}" cannot be empty.`);
                return;
            }
        }

        try {
            const response = await post(api_endpoint.GETPROJECTS, project_data);
            if (response.success) {
                alert(response.message);
                window.location.href = './project.html';
            }
        } catch (err) {
            handleAuthError(err);
            console.error('Error adding project:', err);
            alert(`Failed to add project: ${err.message}`);
        }
    });
});
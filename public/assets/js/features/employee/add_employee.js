import { post, api_endpoint } from "../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    if (!addForm) {
        console.error("Add employee form not found!");
        return;
    }

    addForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Mengambil nilai dari setiap input field
        const employeeData = {
            name: document.getElementById('name-input').value,
            gender: document.getElementById('gender-input').value,
            address: document.getElementById('address-input').value,
            date_of_birth: document.getElementById('date-of-birth-input').value,
            email: document.getElementById('email-input').value,
            telephone_number: document.getElementById('telephone-number-input').value,
            bank_name: document.getElementById('bank-name-input').value,
            account_number: document.getElementById('account-number-input').value,
            join_date: document.getElementById('join-date-input').value,
            position_id: document.getElementById('position-id-input').value,
            employement_status: document.getElementById('employement-status-input').value,
            password: document.getElementById('password-input').value,
        };

        // Validasi untuk memastikan tidak ada field yang kosong
        for (const key in employeeData) {
            if (!employeeData[key]) {
                alert(`Error: Field "${key.replace(/_/g, ' ')}" cannot be empty.`);
                return;
            }
        }

        try {
            const response = await post(api_endpoint.REGISTER, employeeData);

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again later.');
        }
    });

    // TODO: Implementasikan fungsi untuk mengambil data posisi secara dinamis
    // async function loadPositions() {
    //     try {
    //         const response = await fetch('/api/positions'); // Ganti dengan endpoint yang sesuai
    //         const data = await response.json();
    //         const positionSelect = document.getElementById('position-id-input');
    //         // ... (logika untuk mengisi select options)
    //     } catch (error) {
    //         console.error('Failed to load positions:', error);
    //     }
    // }
    // loadPositions();
});
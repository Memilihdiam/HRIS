import { post, api_endpoint } from "../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const modules = [
        "Employees",
        "Departments",
        "Vendors",
        "Clients",
        "Roles",
        "Permissions",
        "Payrolls",
        "Projects"
    ];

    const addForm = document.getElementById('add-form');
    const moduleInput = document.getElementById('module-input');
    const actionInput = document.getElementById('action-input');
    const permissionNameInput = document.getElementById('permission-name-input');

    // Fungsi untuk mengisi dropdown modul
    function populateModules() {
        modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.toLowerCase().replace(/\s+/g, '-'); // e.g., "Employee List" -> "employee-list"
            option.textContent = module;
            moduleInput.appendChild(option);
        });
    }

    // Fungsi untuk meng-generate nama permission
    function generatePermissionName() {
        const moduleValue = moduleInput.value;
        const actionValue = actionInput.value;

        if (moduleValue && actionValue) {
            permissionNameInput.value = `${moduleValue}:${actionValue}`;
        } else {
            permissionNameInput.value = '';
        }
    }

    // Event listener untuk form
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const permissionData = {
            module_name: moduleInput.options[moduleInput.selectedIndex].text,
            action: actionInput.value,
            permission_name: permissionNameInput.value,
            description: document.getElementById('description-input').value,
        };

        try {
            const response = await post(api_endpoint.ADDPERMISSION, permissionData);
            if(response.success){
                window.location.href = '/pages/roles/role.html';
            }
        } catch (error) {
            console.error('Error, ', error);
            alert('An error occurred while adding the permission.');
        }
    });

    // Inisialisasi
    populateModules();
    moduleInput.addEventListener('change', generatePermissionName);
    actionInput.addEventListener('change', generatePermissionName);
});
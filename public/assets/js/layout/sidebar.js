import { fetch_user_data } from "../features/users/user_data.js";
import { handleAuthError } from "../shared/auth.js";

const menuItems = [
    // GENERAL
    { name: 'Dashboard', path: '/pages/dashboards/dashboard.html', icon: 'bi-grid-fill', category: 'GENERAL', roles: ['all'] },
    
    // EMPLOYEE MANAGEMENT
    { name: 'Employee List', path: '/pages/employees/employee_list.html', icon: 'bi-person-fill', category: 'EMPLOYEE MANAGEMENT', roles: ['Super Admin', 'HR'] },
    { name: 'Add Employee', path: '/pages/employees/add_employee.html', icon: 'bi-person-add', category: 'EMPLOYEE MANAGEMENT', roles: ['Super Admin', 'HR'] },
    { name: 'Employee Role', path: '/pages/employees/add_employee_role.html', icon: 'bi-person-badge', category: 'EMPLOYEE MANAGEMENT', roles: ['Super Admin'] },
    
    // ORGANIZATION
    { name: 'Department', path: '/pages/departments/department.html', icon: 'bi-building-fill', category: 'ORGANIZATION', roles: ['Super Admin', 'HR'] },
    
    // VENDORS & CLIENTS
    { name: 'Vendors', path: '/pages/vendors/vendor.html', icon: 'bi-buildings-fill', category: 'VENDORS & CLIENTS', roles: ['Super Admin', 'Procurement'] },
    { name: 'Add Vendor', path: '/pages/vendors/add_vendor.html', icon: 'bi-building-add', category: 'VENDORS & CLIENTS', roles: ['Super Admin', 'Procurement'] },
    { name: 'Clients', path: '/pages/clients/client.html', icon: 'bi-people-fill', category: 'VENDORS & CLIENTS', roles: ['Super Admin', 'Sales'] },
    { name: 'Add Client', path: '/pages/clients/add_client.html', icon: 'bi-person-plus-fill', category: 'VENDORS & CLIENTS', roles: ['Super Admin', 'Sales'] },
    
    // ROLES & PERMISSIONS
    { name: 'Roles', path: '/pages/roles/role.html', icon: 'bi-person-rolodex', category: 'ROLES & PERMISSIONS', roles: ['Super Admin'] },
    { name: 'Add Role Permission', path: '/pages/roles/add_role_permission.html', icon: 'bi-controller', category: 'ROLES & PERMISSIONS', roles: ['Super Admin'] },
    { name: 'Add Permissions', path: '/pages/roles/add_permission.html', icon: 'bi-ui-checks', category: 'ROLES & PERMISSIONS', roles: ['Super Admin'] },
    { name: 'Add Roles', path: '/pages/roles/add_role.html', icon: 'bi-key-fill', category: 'ROLES & PERMISSIONS', roles: ['Super Admin'] },

    // PROJECTS
    { name: 'Project', path: '/pages/projects/project.html', icon: 'bi-gear-fill', category: 'PROJECTS', roles: ['Super Admin'] },
    { name: 'Add Project', path: '/pages/projects/add_project.html', icon: 'bi-gear-wide-connected', category: 'PROJECTS', roles: ['Super Admin'] },
    
    // ACTIVITY (Contoh dari kode sebelumnya)
    { name: 'Payrolls', path: '/pages/payrolls.html', icon: 'bi-cash-stack', category: 'ACTIVITY', roles: ['Super Admin', 'Finance'] },
];

document.addEventListener('DOMContentLoaded', () => {
    const sidebarDisplay = document.getElementById('sidebar-display');

    if (sidebarDisplay) {
        render_sidebar();
    }

    async function render_sidebar() {
        try {
            const user_data = await fetch_user_data();

            // Menentukan halaman aktif untuk menyorot menu
            const currentPage = window.location.pathname;

            // Filter menu yang diizinkan berdasarkan role
            const allowedMenus = menuItems.filter(menu => menu.roles.includes('all') || menu.roles.includes(user_data.role_name));

            // Kelompokkan menu berdasarkan kategori
            const menusByCategory = allowedMenus.reduce((acc, menu) => {
                if (!acc[menu.category]) {
                    acc[menu.category] = [];
                }
                acc[menu.category].push(menu);
                return acc;
            }, {});

            // Buat HTML untuk setiap kategori
            const menuHTML = Object.entries(menusByCategory).map(([category, items]) => {
                const itemHTML = items.map(menu => `
                    <li class="nav-item">
                        <a href="${menu.path}" class="nav-link text-white ${currentPage.includes(menu.path) ? 'active' : ''}">
                            <i class="bi ${menu.icon} me-2"></i>
                            ${menu.name}
                        </a>
                    </li>
                `).join('');

                return `
                    <li class="nav-item mt-2">
                        <span class="nav-link text-secondary text-uppercase small fw-bold">${category}</span>
                    </li>
                    ${itemHTML}
                `;
            }).join('');

            const sidebarHTML = `
                <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark h-100" style="width: 280px;">
                    <a href="/pages/dashboard.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <i class="bi bi-buildings-fill me-2 fs-4"></i>
                        <span class="fs-4">HRIS Corp</span>
                    </a>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        ${menuHTML}
                    </ul>
                    <hr>
                </div>
            `;

            sidebarDisplay.innerHTML = sidebarHTML;

        } catch (error) {
            console.error('Failed to render sidebar:', error);
            handleAuthError(error);
            sidebarDisplay.innerHTML = `<p style="color: red; padding: 1rem;">Could not load user data.</p>`;
        }
    }
});
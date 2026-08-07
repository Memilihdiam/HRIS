import { fetch_user_data } from "../features/users/user_data.js";
import { handleAuthError } from "../shared/auth.js";

// const menuItems = [
//     {name: 'Payrolls', path: '/pages/payrolls.html', icon: 'bi-cash-stack', category: 'ACTIVITY', role: []},
//     {name: 'Employers List', path: '/pages/employee_list.html', icon: 'bi-people-fill', category: 'ACTIVITY', role: ['HR', 'FA']}
// ];

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

            // // Filter menu yang diizinkan berdasarkan role
            // const allowedMenus = menuItems.filter(menu => menu.role.includes(user_data.department_code));

            // // Kelompokkan menu berdasarkan kategori
            // const menuByCategory = allowedMenus.reduce((acc, menu) => {
            //     if (!acc[menu.category]) {
            //         acc[menu.category] = [];
            //     }
            //     acc[menu.category].push(menu);
            //     return acc;
            // }, {});

            // Buat HTML untuk setiap kategori
            // const menuHTML = Object.entries(menuByCategory).map(([category, items]) => {
            //     const itemHTML = items.map(menu => `
            //         <li class="nav-item">
            //             <a href="${menu.path}" class="nav-link text-white ${currentPage.includes(menu.path) ? 'active' : ''}">
            //                 <i class="bi ${menu.icon} me-2"></i>
            //                 ${menu.name}
            //             </a>
            //         </li>
            //     `).join('');

            //     return `
            //         <li class="nav-item mt-2">
            //             <span class="nav-link text-secondary text-uppercase small fw-bold">${category}</span>
            //         </li>
            //         ${itemHTML}
            //     `;
            // }).join('');

            const sidebarHTML = `
                <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark h-100" style="width: 280px;">
                    <a href="/pages/dashboard.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <i class="bi bi-buildings-fill me-2 fs-4"></i>
                        <span class="fs-4">HRIS Corp</span>
                    </a>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item mt-2">
                            <span class="nav-link text-secondary text-uppercase small fw-bold">GENERAL</span>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/dashboard.html" class="nav-link text-white ${currentPage.includes('/pages/dashboard.html') ? 'active' : ''}">
                                <i class="bi bi-grid-fill me-2"></i>
                                Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/employee_list.html" class="nav-link text-white ${currentPage.includes('/pages/employee_list.html') ? 'active' : ''}">
                                <i class="bi bi-person-fill me-2"></i>
                                Employee List
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/department.html" class="nav-link text-white ${currentPage.includes('/pages/Department.html') ? 'active' : ''}">
                                <i class="bi bi-building-fill me-2"></i>
                                Department
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/vendor.html" class="nav-link text-white ${currentPage.includes('/pages/vendor.html') ? 'active' : ''}">
                                <i class="bi bi-buildings-fill me-2"></i>
                                Vendors
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/add_vendor.html" class="nav-link text-white ${currentPage.includes('/pages/add_vendor.html') ? 'active' : ''}">
                                <i class="bi bi-building-add me-2"></i>
                                Add Vendor
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/client.html" class="nav-link text-white ${currentPage.includes('/pages/client.html') ? 'active' : ''}">
                                <i class="bi bi-people-fill me-2"></i>
                                Clients
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/add_client.html" class="nav-link text-white ${currentPage.includes('/pages/add_client.html') ? 'active' : ''}">
                                <i class="bi bi-building-add me-2"></i>
                                Add Client
                            </a>
                        </li>
                    </ul>
                    <hr>
                </div>
            `;

            sidebarDisplay.innerHTML = sidebarHTML;

            const logoutButton = document.getElementById('logout-btn');
            logoutButton?.addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.href = '/';
            });

        } catch (error) {
            console.error('Failed to render sidebar:', error);
            handleAuthError(error);
            sidebarDisplay.innerHTML = `<p style="color: red; padding: 1rem;">Could not load user data.</p>`;
        }
    }
});
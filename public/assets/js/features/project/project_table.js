import { fetch_all_projects } from "./project_data.js";
import { handleAuthError } from "../../shared/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const table_body = document.getElementById('table-body');

    async function render_table() {
        try {
            const data = await fetch_all_projects();
            const projects = data.projects;
            let tableRowHTML = '';

            if (!projects || projects.length === 0) {
                tableRowHTML = `<tr><td colspan="9" class="text-center">No projects found.</td></tr>`;
            } else {
                let no = 1;
                const statusColor = {
                    DRAFT: "badge text-bg-secondary",
                    PLANNING: "badge text-bg-info",
                    RUNNING: "badge text-bg-primary",
                    ON_HOLD: "badge text-bg-warning",
                    COMPLETED: "badge text-bg-success",
                    CLOSED: "badge text-bg-dark"
                };

                projects.forEach(item => {
                    const badgeClass = statusColor[item.status] || "badge text-bg-light";
                    tableRowHTML += `
                        <tr data-id="${item.id}" class="project-row" style="cursor: pointer;">
                            <td>${no++}</td>
                            <td>${item.project_code}</td>
                            <td>${item.project_name}</td>
                            <td>${item.client_name || 'N/A'}</td>
                            <td>${new Date(item.start_date).toLocaleDateString('id-ID')}</td>
                            <td>${new Date(item.end_date).toLocaleDateString('id-ID')}</td>
                            <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.contract_value)}</td>
                            <td><span class="${badgeClass}">${item.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-warning" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                                <button class="btn btn-sm btn-info" title="Details"><i class="bi bi-eye-fill"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }
            table_body.innerHTML = tableRowHTML;
        } catch (error) {
            handleAuthError(error);
            table_body.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Failed to load data. ${error.message}</td></tr>`;
        }
    }

    table_body.addEventListener('click', (e) => {
        // Find the closest row element
        const row = e.target.closest('tr.project-row');
        if (!row) return;

        // Prevent navigation if a button inside the row was clicked
        if (e.target.closest('button')) {
            return;
        }

        const projectId = row.dataset.id;
        if (projectId) {
            window.location.href = `/pages/projects/project_detail/${projectId}`;
        }
    });

    render_table();
});
import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_all_projects(){
    const data = await get(api_endpoint.GETPROJECTS);
    return data;
}

/**
 * Fetches a single project by its ID.
 * @param {string} id - The ID of the project to fetch.
 * @returns {Promise<Object>} - The project data.
 */
export async function fetch_project_by_id(id) {
    return await get(`${api_endpoint.GETPROJECTS}/${id}`);
}
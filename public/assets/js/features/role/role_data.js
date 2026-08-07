import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_role(){
    const data = await get(api_endpoint.ROLEDATA);
    return data;
}

export async function fetch_permission(){
    const data = await get(api_endpoint.PERMISSIONDATA);
    return data;
}

export async function fetch_role_permission(){
    const data = await get(api_endpoint.ROLEPERMISSION);
    return data;
}
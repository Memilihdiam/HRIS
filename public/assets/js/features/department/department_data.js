import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_department_position_data(){
    const data = await get(api_endpoint.DEPARTMENT_POSITION_DATA);
    return data;
}
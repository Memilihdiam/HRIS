import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_employee_list(){
    const data = await get(api_endpoint.EMPLOYEESLIST);
    return data.list;
}
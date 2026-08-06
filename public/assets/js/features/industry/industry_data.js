import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_industry(){
    const data = await get(api_endpoint.INDUSTRYDATA);
    return data;
}
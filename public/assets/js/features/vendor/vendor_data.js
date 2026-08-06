import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_all_vendor(){
    const data = await get(api_endpoint.VENDORDATA);
    return data;
}
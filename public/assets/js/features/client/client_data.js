import { get, api_endpoint } from "../../shared/api.js";

export async function fetch_all_client(){
    const data = get(api_endpoint.CLIENTDATA);
    return data;
}
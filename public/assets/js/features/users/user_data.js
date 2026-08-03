import { get, api_endpoint } from "../../shared/api.js";

/**
 * Mengambil data pengguna yang sedang login dari server.
 * @returns {Promise<Object>} Objek yang berisi data pengguna.
 * @throws {Error} Akan melempar error jika terjadi kegagalan dalam pengambilan data,
 * baik karena masalah jaringan atau respons error dari server.
 */
export async function fetch_user_data(){
    const user = await get(api_endpoint.USERDATA);
    return user.user;
}
import { fetch_user_data } from "../users/user_data.js";

document.addEventListener('DOMContentLoaded', () => {

    async function render_dashboard(){
        const data = await fetch_user_data();
        console.log(data);
    }

    render_dashboard();
})
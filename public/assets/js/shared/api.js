export const api_endpoint = {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    USERDATA: '/api/me',
    EMPLOYEESLIST: '/api/employees',
    DEPARTMENT_POSITION_DATA: '/api/job'
}

async function get(url){
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Send cookies with the request
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        return data;
    }catch(err){
        console.error('Error, ', err);
        throw err;
    }
}

async function post(url, body){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        return data;

    }catch(err){
        console.error('Error, ', err);
        throw err;
    }
}

export { get, post };
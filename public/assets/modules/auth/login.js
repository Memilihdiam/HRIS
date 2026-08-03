const loginForm = document.getElementById('login-form');
const codeInput = document.getElementById('code');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const code = codeInput.value;
    const password = passwordInput.value;
    try{
        const response = await fetch(api_endpoint.LOGIN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                employee_code: code,
                password: password,
            })
        })

        loginBtn.textContent = 'Auth...';

        const data = await response.json();

        if(response.ok){
            localStorage.setItem('token', data.token);
            window.location.href = '/pages/dashboard.html';
        }else{
            message.textContent = data.message;
        }
    }catch(err){
        console.log('Error during login fetch: ', err);
        message.textContent = 'Cannot connect to the server. Please try again later.';
    }finally{
        loginBtn.textContent = 'Login';
    }
})
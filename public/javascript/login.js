const loginForm = document.querySelector('.login_form')
const submitBtn = document.querySelector('.submit_btn')
const login_form = document.querySelector('.login_form')
const errMsg = document.querySelector('.err_msg')

// Password eye close and Open
document.addEventListener('DOMContentLoaded', () => {
    const passEye = document.querySelector('.passEye');
    const passInput = document.getElementsByName('password')[0];

    passEye.addEventListener('click', (e) => {
        if (passEye.classList.contains('bi-eye-slash')) {
            passEye.classList.replace('bi-eye-slash', 'bi-eye');
            passInput.type = 'text';
            setTimeout(() => {
                passInput.type = 'password';
                passEye.classList.replace('bi-eye', 'bi-eye-slash');
            }, 2000);
        } else {
            passEye.classList.replace('bi-eye', 'bi-eye-slash');
            passInput.type = 'password';
        }
    });
});

// Sending login Form data through Fetch
submitBtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    try {

        const form = new FormData(login_form)

        const response = await fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(Object.fromEntries(form))
        })

        const result = await response.json()
        
        if(!response.ok){
            errMsg.innerHTML = result.error
            setTimeout(() => {
                errMsg.innerHTML = ''
            }, 2000);
        }
        else{


        if(result.auth){
            errMsg.innerHTML = 'Login Success'
            errMsg.classList.add('success')
            setTimeout(() => {
                window.location.href = '/home'
            }, 500);
        } else{
            errMsg.innerHTML = 'You need Verify account to Login'
            setTimeout(() => {
                window.location.href = `/otp_verification/${result.mobilenum}`
            }, 1000);
        }
        }

    } catch (error) {
        console.log(error.message);
    }
})  
const signupForm = document.getElementById('signup_form')
const submitBtn = document.querySelector('.submit_btn')
const errorMsg = document.querySelector('.error_msg')

console.log('dfsoghsdfi');

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/
const mobilenumregex = /^\d{10}$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,15}$/


document.addEventListener('DOMContentLoaded', () => {
    const passEye = document.querySelector('.passEye');
    const passwordInput = document.getElementsByName('password')[0];

    passEye.addEventListener('click', (e) => {
        if (passEye.classList.contains('bi-eye-slash')) {
            passEye.classList.replace('bi-eye-slash', 'bi-eye');
            passwordInput.type = 'text';
            setTimeout(() => {
                passwordInput.type = 'password';
                passEye.classList.replace('bi-eye', 'bi-eye-slash');
            }, 2000);
        } else {
            passEye.classList.replace('bi-eye', 'bi-eye-slash');
            passwordInput.type = 'password';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const passEye = document.querySelector('.confirmPassEye');
    const confirmPasswordInput = document.getElementsByName('confirmpassword')[0];

    passEye.addEventListener('click', (e) => {
        if (passEye.classList.contains('bi-eye-slash')) {
            passEye.classList.replace('bi-eye-slash', 'bi-eye');
            confirmPasswordInput.type = 'text';
            setTimeout(() => {
                confirmPasswordInput.type = 'password';
                passEye.classList.replace('bi-eye', 'bi-eye-slash');
            }, 2000);
        } else {
            passEye.classList.replace('bi-eye', 'bi-eye-slash');
            confirmPasswordInput.type = 'password';
        }
    });
});




submitBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    const form = new FormData(signupForm)

    const usernameInput = document.getElementsByName('username')[0].value
    const emailInput = document.getElementsByName('email')[0].value
    const mobileInput = document.getElementsByName('mobilenum')[0].value
    const passwordInput = document.getElementsByName('password')[0].value
    const confirmPasswordInput = document.getElementsByName('confirmpassword')[0].value



    if(emailInput == '' || passwordInput == '' || mobileInput == '' || usernameInput == '' || confirmPasswordInput == '') {
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Please Fill all Fields'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }
    else if (!emailRegex.test(emailInput)) {
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Invalid Email Format'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }
    else if (!mobilenumregex.test(mobileInput)) {
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Please provide a valid Number'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }
    else if (!passwordRegex.test(passwordInput)) {
        errorMsg.style.visibility = 'visible'
        errorMsg.style.fontSize = '.8rem'
        errorMsg.innerHTML = 'Password need one Uppercase and one Number'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }
    else if(passwordInput != confirmPasswordInput){
        errorMsg.style.visibility = 'visible'
        errorMsg.style.fontSize = '.91rem'
        errorMsg.innerHTML = 'Password Mismatch'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }


// -------------------------------------------------------------


    else {
        const form = new FormData(signupForm);
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(form)),
        });

        const result = await response.json()

        if(!response.ok){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = result.error
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
        }
        else{
            errorMsg.style.visibility = 'visible'
            errorMsg.classList.add('success')
            errorMsg.innerHTML = 'Signup Succesfull'
            setTimeout(() => {
                window.location.href = `/otp_verification/${result.mobilenum}`
            }, 1000);
    }
    } catch (error) {
            console.log(error.message);
    }
    }
 
})
/* eslint-disable */
const signup = async (firstName, lastName, phone, email, birthdate, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup', //'http://localhost:3000/api/v1/users/login'
            data: {
                firstName,
                lastName,
                phone,
                email,
                birthdate,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">Signup successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            //alert('Logged in successfully');
            window.setTimeout(() => {
                location.assign('/home')
            }, 1500);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    }

};

document.querySelector('.form--signup').addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    //console.log(firstName, lastName, phone, email, birthdate, password, passwordConfirm);
    signup(firstName, lastName, phone, email, birthdate, password,passwordConfirm);
});
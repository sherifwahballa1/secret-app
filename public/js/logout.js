/* eslint-disable */
const logout = async () => {
    try { 
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if((res.data.status = 'success')) {
            const el = document.querySelector('.alert');
            if(el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">Logged Out Successfully </div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            window.setTimeout(() => {
                location.assign('/')
            }, 1500);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if(el) el.parentElement.removeChild(el);
        const markup = '<div class="alert alert--error">Error Logging our! try again </div>';
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
   }
};

const logOutBtn = document.querySelector('.nav__el--logout');

if(logOutBtn) logOutBtn.addEventListener('click', logout);

const profileBtn = document.querySelector('.w-full.rounded');
if(profileBtn) profileBtn.addEventListener('click', ()=> {
    location.assign('/profile')
})


/*eslint-disable*/
const followUnfollow = async (ownerId, followerId) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/followers/unfollow',
            data: {
                ownerId,
                followerId
            }
        });
  
        if (res.data.status === 'success') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">you follow successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            //alert('Logged in successfully');
            window.setTimeout(() => {
                location.reload()
            }, 1500);
        }
       else if (res.data.status === 'success unfollow') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">you unfollow successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            //alert('Logged in successfully');
            window.setTimeout(() => {
                location.reload()
            }, 1500);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
        //alert(err.response.data.message);
    }
  };

const btnFollow = document.getElementById('btnFollow');
btnFollow.addEventListener('click', () => {
    let ownerId = btnFollow.dataset.ownerId;
    let followerId = btnFollow.dataset.followerId;
    if (btnFollow.style.backgroundColor == 'rgb(82, 15, 74)') {
        btnFollow.style.backgroundColor = '#177315';
        btnFollow.textContent = 'Following';
        followUnfollow(ownerId, followerId);
    }else {
        btnFollow.style.backgroundColor = '#520f4a';
        btnFollow.textContent = 'Follow';
        followUnfollow(ownerId, followerId);
    }
});

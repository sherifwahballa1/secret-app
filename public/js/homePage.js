/*eslint-disable*/
const likeUnlike = async (userId, postId) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/likes/',
            data: {
                userId,
                postId
            }
        });
  
        if (res.data.status === 'success') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">you Like successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            //alert('Logged in successfully');
            window.setTimeout(() => {
                location.reload()
            }, 1500);
        }
       else if (res.data.status === 'success unlike') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">you unlike successfully</div>';
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

function hello(btn)
{
    let postId = btn.dataset.postId;
    let userId = btn.dataset.userId;
    likeUnlike(userId, postId);
}



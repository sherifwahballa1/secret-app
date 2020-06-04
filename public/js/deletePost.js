/* eslint-disable */
const deletePost = async postId => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/posts/${postId}`
        });
  
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">Post Deleted successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            window.setTimeout(() => {
                location.assign('/profile')
            }, 1000);
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
    deletePost(postId);
}



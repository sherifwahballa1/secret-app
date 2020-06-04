/*eslint-disable*/
$(document).ready(function(){
const likeUnlike = async (userId, postId) => {
    try {
        $.ajax({
            global: false,
            type: "POST",
            url: '/api/v1/likes/',
            dataType: 'html',
            data: {
                userId,
                postId
            },
            success: function (result) {
                //$('#ulPost').load(location.href + ' #ulPost');
                location.reload();
            }
        });
    } catch (err) {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
        //alert(err.response.data.message);
    }
  };


const updateData = async (data) => {
    try { 
        const res = await axios({
            method: 'POST',
            url: '/api/v1/comments',
            data
        });
        if((res.data.status = 'success')) {
            //location.reload(true);
            setTimeout(function(){
                window.location.reload();
             }, 1000);
            const el = document.querySelector('.alert');
            if(el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">Comment Add Successfully </div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if(el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
   }
};

const commentFrom = document.querySelector('.form-comment2');

 if(commentFrom) commentFrom.addEventListener('submit', e => {
     e.preventDefault();
     const btnComment = document.getElementById('btnComment');
     let post = btnComment.dataset.postId2;
     let user = btnComment.dataset.userId2;
     const form = new FormData();
     form.append('text', document.getElementById('postText').value);
     form.append('commentImg', document.getElementById('fileImg').files[0]);
     form.append('post', post);
     form.append('user', user);

    updateData(form);
});


const BtnLike = document.querySelector('.btnLike');
if(BtnLike) BtnLike.addEventListener('click', ()=> {
    const btnComment = document.getElementById('btnComment');
    let post = btnComment.dataset.postId2;
    let user = btnComment.dataset.userId2;
    likeUnlike(user, post);
})

});
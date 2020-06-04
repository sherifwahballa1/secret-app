/* eslint-disable */
const updateData = async (data) => {
    try { 
        const res = await axios({
            method: 'POST',
            url: '/api/v1/posts',
            data
        });
        if((res.data.status = 'success')) {
           window.location.reload();
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if(el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
   }
};

const postFrom = document.querySelector('.form-post2');
 if(postFrom) postFrom.addEventListener('submit', e => {
     e.preventDefault();
    const form = new FormData();
    form.append('text', document.getElementById('postText').value);
    form.append('postImg', document.getElementById('fileImg').files[0]);
   updateData(form);
});


// document.getElementById('deleteDorpPost').addEventListener('click', (ev)=> {
// 	alert(this.className);
// })

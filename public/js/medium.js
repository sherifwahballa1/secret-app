/* eslint-disable */
$(document).ready(function() {
    
	$('ul.nav li.dropdown').hover(function() {
	  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
	}, function() {
	  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
	});    
	
	/*============================================
	Scroll To Top
	==============================================*/	

	//When distance from top = 250px fade button in/out
	$(window).scroll(function(){
		if ($(this).scrollTop() > 250) {
			$('#scrollup').fadeIn(300);
		} else {
			$('#scrollup').fadeOut(300);
		}
	});

	//On click scroll to top of page t = 1000ms
	$('#scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 1000);
		return false;
	});


	$('#fileImg').on('change', function(ev) {
		var img_postLi = document.getElementById('img_postLi');
		img_postLi.style.display='block';
		var f = ev.target.files[0];
		var fr = new FileReader();
		fr.onload = function(ev2) {
			$('#img_post').attr('src', ev2.target.result);
	   };
		fr.readAsDataURL(f);
	});

	$('#photo').on('change', function(ev) {
		var f = ev.target.files[0];
		var fr = new FileReader();
		fr.onload = function(ev2) {
			$('#userImg').attr('src', ev2.target.result);
	   };
		fr.readAsDataURL(f);
	});

	$('#coverPhoto').on('change', function(ev) {
		var f = ev.target.files[0];
		var fr = new FileReader();
		fr.onload = function(ev2) {
			$('#userCover').attr('src', ev2.target.result);
	   };
		fr.readAsDataURL(f);
	});

	$('#form-post2').one('submit', function() {
		$(this).find('input[type="submit"]').attr('disabled','disabled');
	});
	

});

document.getElementById('cancelBtn').addEventListener('click', async()=>{
	var photo=document.getElementById('img_post');
	var cancelbtn=document.getElementById('cancelBtn');
		$('#img_post').attr('src', '');
		var img_postLi = document.getElementById('img_postLi');
		img_postLi.style.display='none';

	//var fileImg = await document.getElementById('fileImg');
	document.getElementById('fileImg').value = null;
	 
});
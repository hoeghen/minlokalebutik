//Ultima HTML5 Landing Page v2.1
//Copyright 2014 8Guild.com
//All scripts for Ultima Demo Page

/*Page Preloading*/
$(window).load(function() {

	$('#preloader').delay(300).fadeOut('slow');
	setTimeout(function(){$('.mac-left img').addClass('fadeInLeft');},100);
	setTimeout(function(){$('.mac-right img').addClass('fadeInRight');},100);
	setTimeout(function(){$('.mac-left a').addClass('bounceInDown');},100);
	setTimeout(function(){$('.mac-right a').addClass('bounceInDown');},100);
});

/*Checking if it's touch device we disable some functionality due to inconsistency*/
if (Modernizr.touch) {
	$('*').removeClass('animated');
}

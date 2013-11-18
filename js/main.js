$.fn.isOnScreen = function() {
	var win = $(window);
	var viewport = {
		top : win.scrollTop() - 150,
		left : win.scrollLeft()
	};
	viewport.right = viewport.left + win.width();
	viewport.bottom = viewport.top + win.height();
 
	var bounds = this.offset();
	bounds.right = bounds.left + this.outerWidth();
	bounds.bottom = bounds.top + this.outerHeight();
 
	return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};

var windowHeight;
var originalHeights = [];
function setHeight() {
	windowHeight = $(window).height();
	$("header, section").each(function(i, element) {
		if(typeof originalHeights[i] === 'undefined')
		{
			originalHeights[i] = $(this).height();
			$(this).css('min-height', originalHeights[i]);
			$(this).css('margin-bottom', 0);
		}

		var marginTop = (windowHeight - originalHeights[i]) / 2;
		if(marginTop < 0)
			marginTop = 0;

		$(this).css({
			paddingTop: marginTop,
			height: windowHeight - marginTop
		})
	});
}

$(document).ready(function() {
	setHeight();

	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				window.history.pushState(this.hash.slice(1), $(this).attr('title'), '#' + this.hash.slice(1));
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
});

$(window).resize(function() {
	setHeight();
});

var count;
$(window).scroll(function() {
	$('header, section').each(function(i, element) {
		if($(this).isOnScreen())
		{
			var id = $(this).attr('id');
			window.history.pushState(id, $(this).attr('title'), '#' + id);
			$(".page_menu li.active").removeClass('active');
			$('.page_menu li[data-menu-item="' + id + '"]').addClass('active');

			count = $(this).attr('data-waypoint');
		}
	});

	$('html').attr('data-waypoint', count); 
});
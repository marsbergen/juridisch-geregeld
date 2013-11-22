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
	$('header, section').each(function(i, element) {
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

	$('.order').click(function(ev) {
		ev.preventDefault();

		$('.overlay').css('display', 'block').animate({
			opacity: 0.7
		}, 500);

		$('.order_form').addClass('active');
		var product = $(this).attr('data-product');
		$('input[name="product"]#' + product).click();
	});

	$('.order_form').css('display', 'block');

	$('.overlay').click(function(ev) {
		$('.order_form').removeClass('no_transition').css('top', '').removeClass('active');
		$(this).fadeOut(500, function() {
			$(this).css('opacity', 0);
		});
	});

	$('input[name="product"]').change(function() {
		var id = $(this).attr('id');
		$('label.active').removeClass('active');
		$('label[for="'+id+'"]').addClass('active');

		$('.data-label').html($(this).attr('data-label'));
	});

	$('form').submit(function(ev) {
		ev.preventDefault();

		var postData = $(this).serializeArray();
		var formURL = $(this).attr('action');

		$('form .field').removeClass('error');
		$('form .form_message').remove();

		$.ajax(
		{
			url : formURL,
			type: 'POST',
			data : postData,
			success:function(data, textStatus, jqXHR) 
			{
				$('form').slideUp().after(
					'<div class="note">'+
						'<p>Je ontvangt binnen 24 uur korte vragenlijst per e-mail waardoor we jouw document kunnen maken. Zodra je die vragenlijst hebt teruggestuurd, sturen we je een factuur en mogelijkheid tot betaling. Na jouw betaling gaan we direct voor je aan de slag.</p>' +
					'</div>' +
					'<h3>Heb je nog vragen?</h3>' +
					'<p>Neem contact op met Anne op <a href="mailto:anne@juridischgeregeld.nl">anne@juridischgeregeld.nl</a> en zij kan je verder helpen met al je vragen over onze producten.</p>'
				);

				$('html,body').animate({
					scrollTop: 0
				}, 1000);

			},
			error: function(jqXHR, textStatus, errorThrown) 
			{
				$('form').prepend('<div class="form_message alert">Niet alle velden zijn ingevuld<ul></ul></div>');
				var response = JSON.parse(jqXHR.responseText);
				$.each(response.missing_fields, function(field, errorMessage) {
					$('form #' + field).closest('.field').addClass('error');

					$('.form_message ul').append('<li class="'+field+'">&ndash; '+errorMessage+'</li>');
				});

				$('html,body').animate({
					scrollTop: 0
				}, 1000);
			}
		});
	});
});

$(document).keyup(function(e) {
	if (e.keyCode == 27) {
		if($('.order_form').hasClass('active')) {
			e.preventDefault();
			e.stopPropagation();
			$('.overlay').click();
		}
	}
});

$(window).resize(function() {
	setHeight();
});
var count,
	scrollDiff,
	scrollPosition = 0;
$(window).scroll(function() {
	$('header, section').each(function(i, element) {
		if($(this).isOnScreen())
		{
			var id = $(this).attr('id');
			// window.history.pushState(id, $(this).attr('title'), '#' + id);
			$('.page_menu li.active').removeClass('active');
			$('.page_menu li[data-menu-item="' + id + '"]').addClass('active');

			count = $(this).attr('data-waypoint');
		}
	});

	$('html').attr('data-waypoint', count); 

	var order_box = $('.order_form');
	if(order_box.hasClass('active')) {
		// console.log(order_box.css('top'));
		var cur_top = parseInt(order_box.css('top').replace('px', ''));
		var cur_scroll = $(window).scrollTop();
		scrollDiff = scrollPosition - cur_scroll;
		var maximumTop = ((175 + $('.order_form .inner_box').outerHeight()) - $(window).height()) * -1;

		order_box.addClass('no_transition');

		if(scrollDiff <= 0) // Going Down
		{
			if(cur_top > 25)
			{
				order_box.css('top', 25);
			}
			else if(cur_top <= maximumTop)
			{
				order_box.css('top', maximumTop);
			}
			else
			{
				order_box.css('top', cur_top + scrollDiff);
			}
		}
		else if(scrollDiff > 0 && cur_scroll >= 0)
		{
			if(cur_top >= 25)
			{
				order_box.css('top', 25);
			}
			else
			{
				order_box.css('top', cur_top + scrollDiff);
			}
		}
	}
	scrollPosition = $(window).scrollTop();
});
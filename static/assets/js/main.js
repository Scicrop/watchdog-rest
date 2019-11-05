$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	});

	jQuery('.selectpicker').selectpicker;




	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	$('.equal-height').matchHeight({
		property: 'max-height'
	});

	// var chartsheight = $('.flotRealtime2').height();
	// $('.traffic-chart').css('height', chartsheight-122);


	// Counter Number
	$('.count').each(function () {
		$(this).prop('Counter',0).animate({
			Counter: $(this).text()
		}, {
			duration: 3000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});




	// Menu Trigger
	$('#menuToggle').on('click', function(event) {
		var windowWidth = $(window).width();
		if (windowWidth<1010) {
			$('body').removeClass('open');
			if (windowWidth<760){
				$('#left-panel').slideToggle();
			} else {
				$('#left-panel').toggleClass('open-menu');
			}
		} else {
			$('body').toggleClass('open');
			$('#left-panel').removeClass('open-menu');
		}

	});


	$(".menu-item-has-children.dropdown").each(function() {
		$(this).on('click', function() {
			var $temp_text = $(this).children('.dropdown-toggle').html();
			$(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>');
		});
	});


	// Load Resize
	$(window).on("load resize", function(event) {
		var windowWidth = $(window).width();
		if (windowWidth<1010) {
			$('body').addClass('small-device');
		} else {
			$('body').removeClass('small-device');
		}

	});


});

	let description = '';
	let listHtml = '';
	let cardHtml = '';
		let levelType = 'list-group-item-primary';
		if(data[i].level == 1) levelType = 'list-group-item-danger';
		if(data[i].response.description != null) description = ' ['+data[i].response.description+']';
		else description = '';
		if(data[i].style == 'list') listHtml= listHtml + '<a href="#" class="list-group-item list-group-item-action '+levelType+'"><i class="fa fa-check" aria-hidden="true"></i> &nbsp;'+data[i].serviceName+': '+data[i].response.value+description+'</a>\n';
		else if(data[i].style == 'card') cardHtml = cardHtml + parseCard(data[i].serviceName, data[i].response.value+description, data[i].level);
	}
	document.getElementById("alert-list").innerHTML = listHtml;
	document.getElementById("alert-card").innerHTML = cardHtml;
}
function parseCard(name, description, level){
	let levelType = 'bg-primary';
	if(level == 1) levelType = 'bg-danger';
	let cardHtml = '<div class="card text-white '+levelType+' mb-3"><div class="card-header">'+name+'</div><div class="card-body"><h1 class="card-title">'+description+'</h1></div></div>';
	return cardHtml;
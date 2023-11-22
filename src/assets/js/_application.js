$(document).ready(function() {
	// mobile menu
	$('#mobileMenuBtn').on('click', function () {
		$('#mobileMenu').toggleClass('is-closed');
		$('#mobileMenu').toggleClass('is-open');
		$('#mobileMenuOverlay').toggleClass('is-visible');
		$('#pageContent').toggleClass('is-open-right');
	});

	$('#mobileMenuOverlay').on('click', function () {
		$('#mobileMenu').toggleClass('is-closed');
		$('#mobileMenu').toggleClass('is-open');
		$('#mobileMenuOverlay').toggleClass('is-visible');
		$('#pageContent').toggleClass('is-open-right');
	});

	$('.is-drilldown-submenu-parent').on('click', function (e) {
		e.stopPropagation();
		$(this).find('.submenu').first().toggleClass('is-active');
	});

	// tabs
	var tabIndex = 1;
	var tabHeadItems = $('.ecosystem-slide .tabs-heads').find('.tab');
	var tabContentItems = $('.ecosystem-slide .tabs-content').find('.tabs-cont');

	function tabActivate() {
		tabHeadItems.map(function () {
			$(this).removeClass('-active');
			var itemId =  $(this).find('.tab-button').data('tabid');
			if (itemId === tabIndex) {
				$(this).addClass('-active');
			}
		});

		tabContentItems.map(function () {
			$(this).removeClass('-active');
			var itemId =  $(this).data('tabcontid');
			if (itemId === tabIndex) {
				$(this).addClass('-active');
			}
		});
	};

	tabActivate();

	$('.ecosystem-slide .tabs-heads .tab-button').click(function() {
		tabIndex = $(this).data('tabid');
		tabActivate();
	});

	// scroll event
	$(document).on('scroll', function () {
		categoryItemActive();
	});

	// category menu
	var categoryMenuItems = $('.navigation__middle .menu').find('li');
	var categoryMenuMobileItems = $('#mobileMenu').find('.nav-link');
	var categoryScrollItems = categoryMenuItems.map(function() {
		var srollItemId = $(this).find('.link').data('anchor');
		var item = $(srollItemId);
		if (item.length) {
			return item;
		}
	});

	var activeClick = {
		active: false,
		id: null
	}

	$('.navigation .menu .link').click(function() {
		var srollToId = $(this).data('anchor');

		activeClick.active = true;
		activeClick.id = srollToId;

		$('.navigation .menu li').removeClass('-active');
		$(this).parent().addClass('-active');
		$([document.documentElement, document.body]).animate({
			scrollTop: $(srollToId).offset().top
		}, 1000);
	});

	$('#mobileMenu .nav-link a').click(function() {
		var srollToId = $(this).data('anchor');

		activeClick.active = true;
		activeClick.id = srollToId;

		$('#mobileMenu .nav-link').removeClass('-active');
		$(this).parent().addClass('-active');

		$('#mobileMenu').toggleClass('is-closed');
		$('#mobileMenu').toggleClass('is-open');
		$('#mobileMenuOverlay').toggleClass('is-visible');
		$('#pageContent').toggleClass('is-open-right');

		$([document.documentElement, document.body]).animate({
			scrollTop: $(srollToId).offset().top
		}, 1000);
	});

	function categoryItemActive() {
		var fromTop = $(this).scrollTop();
		if (fromTop > 70) {
			$('header').addClass('-scrolled');
		} else {
			$('header').removeClass('-scrolled');
		}
		var cur = categoryScrollItems.map(function() {
			if ($(this).offset().top - 500 < fromTop) {
				return this;
			}
		});

		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";

		if (id) {

			if (activeClick.active) {

				if ( activeClick.id == `#${id}` ) {
					activeClick.active = false;
					activeClick.id = null;

					$('.navigation .menu li').removeClass('-active');
					$('#mobileMenu .nav-link').removeClass('-active');
					categoryMenuItems.find('.link').filter("[data-anchor='#"+id+"']").parent().addClass("-active");
					categoryMenuMobileItems.find('a').filter("[data-anchor='#"+id+"']").parent().addClass("-active");
				}

			} else {
				$('.navigation .menu li').removeClass('-active');
				$('#mobileMenu .nav-link').removeClass('-active');
				categoryMenuItems.find('.link').filter("[data-anchor='#"+id+"']").parent().addClass("-active");
				categoryMenuMobileItems.find('a').filter("[data-anchor='#"+id+"']").parent().addClass("-active");
			}

		} else {
			$('.navigation .menu li').removeClass('-active');
			$('#mobileMenu .nav-link').removeClass('-active');
		}
	};

	// Calculator
	var power_min = 3.6;
	var power_max = 55;
	var power_step = 0.1; // const
	var duration_min = 1;
	var duration_max = 24;
	var duration_step = 1; // const
	var btc_price_min = 48000;
	var btc_price_max = 160000;
	var btc_price_step = 100; // const
	var th_price = 55;
	var mined_per_th_monthly = 0.00008737864078;
	var bonus_k = 0.5;

	function valuesRange(start, stop, step, fixed) {
		return Array.from(
			{ length: (stop - start) / step + 1 },
			function(value, index) {
				return (start + index * step).toFixed(fixed)
			}
		);
	}

	var power_values = valuesRange(power_min, power_max, power_step, 1).map(function(val) {
		return Number(val)
	});

	var duration_values = valuesRange(duration_min, duration_max, duration_step, 0).map(function(val) {
		return Number(val)
	});

	var btc_price_values = valuesRange(btc_price_min, btc_price_max, btc_price_step, 0).map(function(val) {
		return Number(val)
	});

	var power = 7;
	var duration = 24;
	var btc_price = 68000;

	function updateCalc(new_power, new_duration, new_btc_price) {
		power = new_power ? Number(new_power) : power;
		duration = new_duration ? Number(new_duration) : duration;
		btc_price = new_btc_price ? Number(new_btc_price) : btc_price;

		var ths_bonus = power / (power_max - power_min);
		var invested = power * th_price;
		var income = mined_per_th_monthly * (power + ths_bonus) * duration * btc_price;
		var contract_profit = ((income - invested) / invested) * (1 + ths_bonus) * bonus_k * 100;
		var total_btc = mined_per_th_monthly * (power + ths_bonus) * duration;
		var monthly_mining = mined_per_th_monthly * (power + ths_bonus);
		var annually_mining = mined_per_th_monthly * (power + ths_bonus) * 12;
		var total_mining = mined_per_th_monthly * (power + ths_bonus) * duration;

		$('#ths_power').text(`${power} TH/s`);
		$('#ths_bonus').text(`+${ths_bonus.toFixed(2).replace(/\.?0+$/, '')} TH/s BONUS`);
		$('#invested').text(`Invested: ${invested.toFixed(2).replace(/\.?0+$/, '')} USD`);
		$('#income').text(`Total Profit: ${income.toFixed(2).replace(/\.?0+$/, '')} USD`);
		$('#contract_profit').text(`Contract Profit: ${contract_profit.toFixed(2).replace(/\.?0+$/, '')}%`);
		$('#contract_profit_percent').text(`${contract_profit.toFixed(2).replace(/\.?0+$/, '')}%`);
		$('#total_usd').text(`Total: ${income.toFixed(2).replace(/\.?0+$/, '')} USD (${total_btc.toFixed(8).replace(/\.?0+$/, '')} BTC)`);
		$('#monthly_mining').text(`${monthly_mining.toFixed(8)} BTC`);
		$('#annually_mining').text(`${annually_mining.toFixed(8)} BTC`);
		$('#total_mining').text(`${total_mining.toFixed(8)} BTC`);

	}

	updateCalc(power, duration, btc_price);

	// Range sliders
	new rSlider({
		target: '#power_rangeSlider',
		values: power_values,
		range: false,
		set: [power],
		tooltip: true,
		onSlide: function (vals) {
			updateCalc(vals)
		}
	});

	new rSlider({
		target: '#duration_rangeSlider',
		values: duration_values,
		range: false,
		set: [duration],
		tooltip: true,
		onSlide: function (vals) {
			updateCalc(null, vals);
		}
	});

	new rSlider({
		target: '#forecast_rangeSlider',
		values: btc_price_values,
		range: false,
		set: [btc_price],
		tooltip: true,
		onSlide: function (vals) {
			updateCalc(null, null, vals);
		}
	});

	// Calculator details
	$('.total__details-col').on('click', function () {
		$(this).toggleClass('-hidden');
	});

	// Image Carousel
	var thumbsCarousel = new Swiper('.thumbsCarousel', {
		loop: true,
		spaceBetween: 10,
		slidesPerView: 5,
		freeMode: true,
		watchSlidesProgress: true,
	});

	new Swiper('.imageCarousel', {
		slidesPerView: 1,
		spaceBetween: 10,
		loop: true,
		thumbs: {
			swiper: thumbsCarousel,
		},
	});

	new Swiper(".reviews-carousel", {
		slidesPerView: 1.4,
		loop: true,
		spaceBetween: 20,
		grabCursor: true,
		breakpoints: {
			540: {
				slidesPerView: 2.5,
			},
			1024: {
				slidesPerView: 3.3,
			},
			1199: {
				slidesPerView: 4,
			},
		}
	});

	// FAQ
	$('.faq-question-col').on('click', function () {
		$(this).toggleClass('-hidden');
	});

	// Mobila Navigation Lang
	$('#mobileNavigationLang').on('click', function () {
		$(this).toggleClass('-visible');
	});

	// Langs
	$('.navigation-lang__tooltip_item').on('click', function () {
		var locale = $(this).attr('locale');
		window.localStorage.setItem('locale', locale)
	});
});

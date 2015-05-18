(function ($) {
	$(function () {

		// UserAgent Check
		var uaCheck = (function () {
			// https://github.com/faisalman/ua-parser-js
			var url = "bower_components/ua-parser-js/dist/ua-parser.min.js";
			$.getScript(url, function () {
				var parser = new UAParser();
				var result = parser.getResult();

				var browser = result.browser.name;
				var device = result.device.type;
				var os = result.os.name;

				$('html').addClass(browser + ' ' + os);
			});

			// IE Check : http://blog.grotesq.com/post/478
			var ua = navigator.userAgent.toLowerCase();
			// IE7엔 브라우저 엔진명인 Trident가 없고 IE11엔 MSIE란 문자열이 없으므로 두 가지 경우를 다 체크합니다.
			if (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1) {
				var version = 11;
				ua = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
				if (ua) {
					version = parseInt(ua[1]);
				}
				var classNames = '';
				// 기존의 방식에 is-ie 라는 클래스도 추가해봅니다.
				classNames += ' is-ie';
				// 마찬가지로 기존의 방식에 현재 버전 표시를 추가해봅니다.
				classNames += ' ie' + version;
				for (var i = version + 1; i <= 11; i++) {
					classNames += ' lt-ie' + i;
				}
				// html 태그에 클래스를 추가합니다.
				document.getElementsByTagName('html')[0].className += classNames;
			}
		}());


		// matchMedia를 이용한 반응형 이미지와 백그라운드 처리
		// ex) <img class="response" src="./images/logo.png" data-media-tablet="./images/main_visual_02.jpg" data-media-mobile="./images/main_visual_03.jpg" alt="KT M mobile"/>
		var getDevice = function () {

			var $response = $('.response');
			// 초기 src값을 배열에 담기
			var imgSrc = $response.map(function () {

				var tag = this.tagName;
				var mobile = $(this).data("media-mobile");
				var tablet = $(this).data("media-tablet");

				if (mobile || tablet) {
					if (tag === 'IMG') {
						return this.src;
					} else {
						return this.style.backgroundImage;
					}
				}
			});

			var setDevice = function () {
				var matchmedia = {
					mobile: "(max-width: 767px)",
					tablet: "(min-width: 768px) and (max-width: 979px)",
					desktop: "(min-width: 979px)"
				};

				var device, keyword;

				if ($('.lt-ie10').length) {// IE10이하 처리
					if ($('.ie9').length) {// IE9 처리 : matchMedia Polyfill
						var url = "bower_components/matchmedia/matchMedia.js";
						$.getScript(url, function () {
							keyword = matchMedia;
							deviceChange();
							imgChange();
						});
					} else { // IE9이하 처리
						var matchmedia = {
							mobile: 767,
							desktop: 979
						};

						var deviceChangeIE8 =(function() {
							if ($(window).width() <= matchmedia.mobile) {
								device = 'mobile';
							} else if ($(window).width() > matchmedia.mobile && $(window).width() <= matchmedia.desktop) {
								device = 'tablet';
							} else {
								device = 'desktop';
							}
						}());
						imgChange();
						$(window).resize(function () {
							deviceChangeIE8;
							imgChange();
						});

						console.log(device)
					}
				} else {
					keyword = window.matchMedia;
					deviceChange();
					imgChange();
				}

				function deviceChange() {
					if (keyword(matchmedia.mobile).matches) {
						device = 'mobile';
					} else if (keyword(matchmedia.tablet).matches) {
						device = 'tablet';
					} else {
						device = 'desktop';
					}
				}

				function imgChange() {
					$('html').attr('data-media', device);

					$response.each(function (i) {

						var tag = this.tagName;
						var mobile = $(this).data("media-mobile");
						var tablet = $(this).data("media-tablet");

						if (tag === 'IMG') { // 이미지일 때
							var defaultImg = $(this).attr('src', imgSrc[i]);
							if (device !== 'desktop') {
								if (device === 'mobile') {
									mobile ? $(this).attr('src', $(this).attr('data-media-' + device)) : defaultImg;
								} else {
									tablet ? $(this).attr('src', $(this).attr('data-media-' + device)) : defaultImg;
								}
							} else {
								defaultImg;
							}
						} else { // background일 때
							var defaultImg = $(this).css('background-image', imgSrc[i]);
							if (device !== 'desktop') {
								if (device === 'mobile') {
									mobile ? $(this).css('background-image', 'url(' + $(this).attr('data-media-' + device) + ')') : defaultImg;
								} else {
									tablet ? $(this).css('background-image', 'url(' + $(this).attr('data-media-' + device) + ')') : defaultImg;
								}
							} else {
								defaultImg;
							}
						}
					});
				};
			};

			setDevice();

			$(window).resize(function () {
				setDevice();
			});

		};

		// sub banner-list
		var bannerBtn = $('.banner-btn a');
		bannerBtn.on({
			'click': function () {
				$('#banner-wrap').stop().animate({
					height: 'toggle'
				}, 300);
				$(this).toggleClass('open');

			}
		})


		// header include
		$.get("./header.html", function (data) {
			$("#header").html(data);
			var windowSize = $(window).width();

			getDevice();


			// 2depth Menu 초기 셋팅
			function adjustMenu() {
				$('.dropdown').each(function (idx) {
					var offsetLeft = parseInt($(this).offset().left);
					var subMenu = $(this).find('.dropdown-menu');
					if (idx < 3) {
						subMenu.css({'padding-left': offsetLeft});
					} else {
						subMenu.css({'padding-left': offsetLeft - 150});
					}

				})
			}

			adjustMenu();


			$(window).on('resize', function () {
				windowSize = $(window).width();

				$('.dropdown').each(function (idx) {
					var offsetLeft = parseInt($(this).offset().left);
					var subMenu = $(this).find('.dropdown-menu');
					// subMenu.css({'padding-left': offsetLeft});

					if (windowSize >= 768) {
						if (idx < 3) {
							subMenu.css({'padding-left': offsetLeft});
						} else {
							subMenu.css({'padding-left': offsetLeft - 150});
						}
					} else {
						subMenu.css({'padding-left': 0})
					}

				})

			})

		})


		// footer include
		$.get("./footer.html", function (data) {
			$("#footer").html(data);
			// 패밀리 사이트
			$('#footer select').change(function () {
				var url = this.value;
				window.open(url, '_blank');
			});
		});


		// sidebar 활성화
		$('body').scrollspy({target: '.sidebar'});

		// sidebar tooltip
		$('.sidebar').on('activate.bs.scrollspy', function () {
			$('[data-toggle="tooltip"]').tooltip('show');
		})


		// animation
		$.fn.scrollAni = function () {
			return this.each(function () {
				$('li:not(.top)').on({
					click: function () {
						var target = $(this).find('a').attr('href');
						$('html, body').stop().animate({
							scrollTop: $(target).offset().top
						}, 400);
						return false;
					}
				});
				$('.top').on({
					click: function (e) {
						$('html, body').stop().animate({
							scrollTop: 0
						}, 200);
					}
				});
			})
		}

		$('.sidebar').scrollAni();


		// bxSlider-plugIn
		if ($('.bxslider').length) {
			$('.bxslider').bxSlider({
				auto: true,
				autoControls: true,
				responsive: true,
				touchEnabled: true,
				easing: 'ease-out',
				pause: 3000
			});
		}


	});
})(jQuery);
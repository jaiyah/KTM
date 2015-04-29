(function ($) {
    $(function () {

        // header include
        $.get("./header.html", function (data) {
            $("#header").html(data);
            var windowSize = $(window).width();
            $(window).on('resize',function(){
                windowSize = $(window).width();
                if( windowSize >= 768 ) {
                    dropdownHover();
                } else {
                    $('ul.nav li.dropdown').off('mouseenter mouseleave');
                }
            })

            function dropdownHover() {
            $('ul.nav li.dropdown').hover(function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
                    var offsetLeft = parseInt($(this).offset().left);
                    var subMenu = $(this).find('.dropdown-menu');
                    subMenu.css({'padding-left': offsetLeft});
                    if(subMenu.closest('.dropdown').hasClass('last')) {
                        subMenu.css({'padding-left': offsetLeft - 150});
                    }
            }, function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
            });
            }
            dropdownHover();

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
                    var offsetLeft = parseInt($(this).offset().left - 5);
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


        // IE Chceck
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1) {
            var version = 11;
            ua = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
            if (ua) {
                version = parseInt(ua[1]);
            }
            var classNames = '';
            classNames += ' is-ie';
            classNames += ' ie' + version;
            for (var i = version + 1; i <= 11; i++) {
                classNames += ' lt-ie' + i;
            }
            document.getElementsByTagName('html')[0].className += classNames;
        }


    });
})(jQuery);
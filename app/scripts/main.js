$(function () {

    // sidebar 활성화
    $('body').scrollspy({target: '.sidebar'});

    // sidebar tooltip
    $('[data-toggle="tooltip"]').tooltip('show');
    $('.sidebar').on('activate.bs.scrollspy', function () {
        $('[data-toggle="tooltip"]').tooltip('show');
    })

    // sidebar scroll animation
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


    // header,footer include
    $.get("header.html", function (data) {
        $(".header").html(data);
    });
    $.get("footer.html", function (data) {
        $(".footer").html(data);
    });

})
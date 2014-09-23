$(function(){
    //Preparations for parallax

    $('#first-fold').css({
        'top': 0,
        'position': 'fixed',
        'width': '100%'
    });

    $('#first-fold').closest('section').css('height','100%');

    $('.parallax-divider.pink').css({
        transform: 'translateY(0px)',
        'z-index': 10,
        position: 'absolute',
        width: '100%'
    });


    $('.parallax-divider.black').css({
        transform: 'translateY(0px)',
        'z-index': 10,
        position: 'absolute',
        width: '100%',
        'margin-bottom': '50px'
    });

    $('#how-it-works').css('margin-top',49);
});

$(window).scroll(function(e) {

    var _wheight = $(window).height();

    var _scroll_top = $(window).scrollTop();
    var _margin_top = _scroll_top / 2;

    //First fold move 2 times slower
    $('#first-fold').css('margin-top', -_margin_top);

    var pinkTop = $('.parallax-divider.pink').offset().top;


    //dividers move faster
    if($('#sign-up').offset().top <= window.screen.availHeight + window.scrollY){
        var initialScroll = $('#sign-up').offset().top - window.innerHeight ;
        var dividerHeight = $('.parallax-divider.pink').outerHeight();
        var toScroll = Math.max(-((window.scrollY-initialScroll)/2),-dividerHeight);
        $('.parallax-divider.pink').css('margin-top',toScroll);
    }


    if($('#how-it-works').offset().top <= window.screen.availHeight + window.scrollY + 125){
        var initialScroll = $('#how-it-works').offset().top - window.innerHeight + 125;
        var dividerHeight = $('.parallax-divider.pink').outerHeight();
        var toScroll = Math.max(-((window.scrollY-initialScroll)/2),-dividerHeight+50);
        $('.parallax-divider.black').css('margin-top',toScroll);
    }
});

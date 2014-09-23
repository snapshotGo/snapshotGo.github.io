$(window).scroll(function(e) {

    var _wheight = $(window).height();
    //var first_fold_height =  $('.parallax-divider.black').height();

    // Home
    var _scroll_top = $(window).scrollTop();
    var _margin_top = _scroll_top / 2;

	//var move_up_by = Math.max(_margin_top,first_fold_height);
    $('#first-fold').css('margin-top', -_margin_top);
	$('#first-fold').css({
		'top': 0,
		'position': 'fixed',
		'width': '100%'
	});

	$('#first-fold').closest('section').css('height','100%');

    // $('#sign-up').css('background','linear-gradient(to right, rgba(254,254,254,0.1) 0%,rgba(0,0,0,0.25)'+ _margin_top/10 + '%)');

    var pinkTop = $('.parallax-divider.pink').offset().top;


    $('.parallax-divider.pink').css({
        transform: 'translateY(0px)',
        'z-index': 10,
        position: 'absolute',
        width: '100%'
    });

    if($('#sign-up').offset().top <= window.screen.availHeight + window.scrollY){
        var initialScroll = $('#sign-up').offset().top - window.innerHeight ;
        var dividerHeight = $('.parallax-divider.pink').outerHeight();
        var toScroll = Math.max(-((window.scrollY-initialScroll)/2),-dividerHeight);
        $('.parallax-divider.pink').css('margin-top',toScroll);
    }


    // $('.parallax-divider.black').css({
    //     transform: 'translateY(0px)',
    //     'z-index': 10,
    //     position: 'absolute',
    //     width: '100%',
    //     // 'margin-bottom': '50px'
    // });

    // if($('#how-it-works').offset().top <= window.screen.availHeight + window.scrollY){
    //     var initialScroll = $('#how-it-works').offset().top - window.innerHeight;
    //     var dividerHeight = $('.parallax-divider.pink').outerHeight();
    //     var toScroll = Math.max(-((window.scrollY-initialScroll)/2),-dividerHeight+50);
    //     $('.parallax-divider.black').css('margin-top',toScroll);
    // }


    // if (_margin_top > 150) {
    // $('.parallax-divider.black').css('height', 156 - _margin_top + 150);
    // } else {
    //     $('.parallax-divider.black').css('height', '');
    // }

    //      var offsetSecondFold = $('#how-it-works').offset().top;


    // if(offsetSecondFold<= _scroll_top + _wheight){
    //  $('.parallax-divider.pink').css('margin-top', - 2*_margin_top + offsetSecondFold);
    // } else{
    //  $('.parallax-divider.pink').css('margin-top','');
    // }
});

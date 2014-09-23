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

    // //$('#first-fold').find()

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

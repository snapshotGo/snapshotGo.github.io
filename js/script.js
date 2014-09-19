$(function (){
	var firstFoldHeight = $('#first-fold').height();

	$(window).scroll(function(e) {
      var _wheight = $(window).height();
      
      // Home
      var _scroll_top = $(window).scrollTop();
      var _margin_top = _scroll_top/2;
      //$('.parallax-divider.black').css('margin-top', -_margin_top);
      $('#first-fold').css('height', firstFoldHeight -_margin_top);


      if(_margin_top>150){
      	$('.parallax-divider.black').css('height', 156-_margin_top+150);
	  }
    }).scroll();
});
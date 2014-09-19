$(function (){

	$(window).scroll(function(e) {
      var _wheight = $(window).height();
	  //var firstFoldHeight = $('#first-fold').height();
	  //var secondFoldHeight = $('#second-fold').height();

      // Home
      var _scroll_top = $(window).scrollTop();
      var _margin_top = _scroll_top/2;

      $('#first-fold').css('height', 797 -_margin_top);
      



      // $('#second-fold').css('height', secondFoldHeight + 10 -_margin_top);


      if(_margin_top>150){
          $('.parallax-divider.black').css('height', 156-_margin_top+150);
	  }
    });
});
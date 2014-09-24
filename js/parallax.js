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


    function moveDivider ($elAfter,$elToMove,reactionOffset,moveOffset) {
        var elOffsetTop = $elAfter.offset().top;
        reactionOffset = reactionOffset || 0;
        moveOffset = moveOffset || 0;

        if(elOffsetTop <= window.innerHeight + window.scrollY + reactionOffset){
            var initialScroll = elOffsetTop - window.innerHeight + reactionOffset;
            var dividerHeight = $elToMove.outerHeight();
            var toScroll = Math.max(-((window.scrollY-initialScroll)/2),-dividerHeight+moveOffset);

            
            $elToMove.css('margin-top',toScroll);
        }    
    }


    $(window).scroll(function(e) {

        var _wheight = $(window).height();

        var _scroll_top = $(window).scrollTop();
        var _margin_top = _scroll_top / 2;

        //First fold move 2 times slower
        $('#first-fold').css('margin-top', -_margin_top);

        var pinkTop = $('.parallax-divider.pink').offset().top;


        moveDivider($('#sign-up'),$('.parallax-divider.pink'));
        moveDivider($('#how-it-works'),$('.parallax-divider.black'),80,50);
    });
});
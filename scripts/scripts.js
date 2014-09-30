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
        // 'margin-bottom': '50px'
    });

    // $('#how-it-works').css('margin-top',49);


    function moveDivider ($elAfter,$elToMove,reactionOffset,moveOffset,back) {
        var elOffsetTop = $elAfter.offset().top;
        reactionOffset = reactionOffset || 0;
        moveOffset = moveOffset || 0;

        if(elOffsetTop + reactionOffset <= window.innerHeight + window.pageYOffset){
            var initialScroll = elOffsetTop - window.innerHeight + reactionOffset;
            var dividerHeight = $elToMove.outerHeight();
            var toScroll = Math.max(-((window.pageYOffset-initialScroll)/2),-dividerHeight+moveOffset);

            if(back){
                var backgroundPosition  =  Math.max(((window.pageYOffset-initialScroll)/2),0);
                $('#infographic').css('margin-top',backgroundPosition);
            }
            
            $elToMove.css('margin-top',toScroll);
        }else{
            $elToMove.css('margin-top','');
            $('#infographic').css('margin-top','');
        }
    }


    $(window).scroll(function(e) {

        var _wheight = $(window).height();

        var _scroll_top = $(window).scrollTop();
        var _margin_top = _scroll_top / 2;

        //First fold move 2 times slower
        $('#first-fold').css('margin-top', -_margin_top);

        var pinkTop = $('.parallax-divider.pink').offset().top;


        moveDivider($('#sign-up'),$('.parallax-divider.pink'),0,0,true);
        moveDivider($('#how-it-works'),$('.parallax-divider.black'),80,0);
    });
});
$(function() {

    var afterLoad = function() {

        function contains(text, searchText) {
            if (text.indexOf(searchText) != -1)
                return true;
            return false;
        }

        //Address
        $('a[rel=internal]').address();
        var _scroll_animation_running = false;
        $.address.change(function(e) {
            var pageUrl = e.path;
            var _target_page = $('section[data-url="' + pageUrl + '"]');

            var _target_page_id = '';
            var _is_sub = false;
            if (_target_page.data('id')) {
                _target_page_id = _target_page.data('id');
            }


            if ($.address.history()) {
                _scroll_animation_running = true;
                _set_active_nav_item(_target_page_id);


                var _scroll_to = _target_page;
                if (_target_page.data('id') == 'informations') {
                    _scroll_to = 0;
                }

                $.scrollTo(_scroll_to, {
                    duration: 800,
                    axis: 'y',
                    easing: 'easeOutQuart',
                    onAfter: function() {
                        _scroll_animation_running = false;
                    }
                });
            }

        });

        _set_active_nav_item = function(_target_id) {
            _id = _target_id;
            if (!_id) {
                _id = _get_current_page();
                if (_id.data('id')) {
                    _id = _id.data('id');
                } else {
                    _id = _id.data('parent');
                }
            }
            $('nav.main li').removeClass('current');
            $('nav.main li.btn-' + _id).addClass('current');
        };

        //In viewport is broken
        _get_current_page = function() {

            var _active_page = $('.main > section').inViewport().first();

            if ($('.main > section').inViewport().first().data('id') == 'informations' && $(window).scrollTop() > 300) {
                _active_page = $('.main > section').inViewport().eq(1);
            }

            if (_active_page.find('section.current').length) {
                _active_page = _active_page.find('section.current');
            }

            return _active_page;
        };


        var _scroll_timeout = false;
        $(window).scroll(function() {

            if ($('body').is('.page-404')) return;

            if (!_scroll_animation_running) {
                _set_active_nav_item();
            }

            if (_scroll_timeout)
                window.clearTimeout(_scroll_timeout);

            _scroll_timeout = window.setTimeout(function() {
                var _current_page = _get_current_page();
                $.address.history(false);

                setTimeout(function() {}, 1);
                var url = _current_page.data('url');
                if (typeof _current_page.attr('data-urlpart') !== 'undefined') {
                    url = url + _current_page.attr('data-urlpart') + '/';
                }

                $.address.value(url);
                $.address.history(true);

            }, 400);

        });
    };

    i18n.init().done(function(t) {
        $("[data-i18n]").i18n();
        afterLoad();
        $.address.update();
    });
});

$(function() {

    $('.btn-imprint').hover(function() {
        $('body').addClass('open-imprint');
    }, function() {
        $('body').removeClass('open-imprint');
    }).click(function(e) {
        e.preventDefault();
    });

    $('nav.main .imprint').hover(function() {
        $('body').addClass('open-imprint');
    }, function() {
        $('body').removeClass('open-imprint');
    });

    $('.btn-contact').hover(function() {
        $('body').addClass('open-contact');
    }, function() {
        $('body').removeClass('open-contact');
    }).click(function(e) {
        e.preventDefault();
    });

    $('nav.main .contact').hover(function() {
        $('body').addClass('open-contact');
    }, function() {
        $('body').removeClass('open-contact');
    });

    $('.flag-gb').click(function () {
        $.i18n.setLng('en');
        $("[data-i18n]").i18n();
    });

    $('.flag-de').click(function () {
        
        $.i18n.setLng('de').then(function () {
            $("[data-i18n]").i18n();
        });
    });
});

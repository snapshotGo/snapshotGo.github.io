$(function() {

    function contains(text, searchText) {
        if (text.indexOf(searchText) != -1)
            return true;
        return false;
    }

    //Address
    $('a[rel=internal]').address();

    $.address.change(function(e) {
        var pageUrl = e.path;
        var _target_page = $('section[data-url="' + pageUrl + '"]');
        var _title = _target_page.data('title') + ' / ' + $('body').data('site-name');
        if (!contains(_title, "null")) {
            $.address.title(_title);
        }


        var _target_page_id = '';
        var _is_sub = false;
        if (_target_page.data('id')) {
            _target_page_id = _target_page.data('id');
        }


        if ($.address.history()) {

            _scroll_animation_running = true;
            _set_active_nav_item(_target_page_id);


            var _scroll_to = _target_page;
            if (_target_page.data('id') == 'home') {
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
    }

    _get_current_page = function() {

        var _active_page = $('.main > section').inViewport().first();

        if ($('.main > section').inViewport().first().data('id') == 'home' && $(window).scrollTop() > 300) {
            _active_page = $('.main > section').inViewport().eq(1);
        }

        if (_active_page.find('section.current').length) {
            _active_page = _active_page.find('section.current');
        }

        return _active_page;
    }



    $(window).scroll(function(e) {
        var _wheight = $(window).height();

        // Home
        var _scroll_top = $(window).scrollTop();
        var _margin_top = _scroll_top / 2;

        // $('#first-fold').css('margin-top', -_margin_top);

        // //$('#first-fold').find()

        // if (_margin_top > 150) {
        //     $('.parallax-divider.black').css('height', 156 - _margin_top + 150);
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
            var url = _current_page.data('url')
            if (_current_page.attr('data-urlpart') != undefined) {
                url = url + _current_page.attr('data-urlpart') + '/';

            }
            //console.log(_current_page.attr('data-urlpart'));
            //if(!(window.location.pathname, '/hero'))
            //{
            $.address.value(url);
            //$.address.value(window.location.pathname);
            $.address.history(true);
            //}
        }, 400);

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

    $('header.main .imprint').hover(function() {
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

    $('header.main .contact').hover(function() {
        $('body').addClass('open-contact');
    }, function() {
        $('body').removeClass('open-contact');
    });

});

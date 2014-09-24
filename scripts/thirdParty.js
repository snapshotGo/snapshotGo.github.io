/*! jQuery Address v${version} | (c) 2009, 2013 Rostislav Hristov | jquery.org/license */
(function ($) {

    $.address = (function () {

        var _trigger = function(name) {
               var e = $.extend($.Event(name), (function() {
                    var parameters = {},
                        parameterNames = $.address.parameterNames();
                    for (var i = 0, l = parameterNames.length; i < l; i++) {
                        parameters[parameterNames[i]] = $.address.parameter(parameterNames[i]);
                    }
                    return {
                        value: $.address.value(),
                        path: $.address.path(),
                        pathNames: $.address.pathNames(),
                        parameterNames: parameterNames,
                        parameters: parameters,
                        queryString: $.address.queryString()
                    };
                }).call($.address));
                $($.address).trigger(e);
                return e;
            },
            _array = function(obj) {
                return Array.prototype.slice.call(obj);
            },
            _bind = function(value, data, fn) {
                $().bind.apply($($.address), Array.prototype.slice.call(arguments));
                return $.address;
            },
            _unbind = function(value,  fn) {
                $().unbind.apply($($.address), Array.prototype.slice.call(arguments));
                return $.address;
            },
            _supportsState = function() {
                return (_h.pushState && _opts.state !== UNDEFINED);
            },
            _hrefState = function() {
                return ('/' + _l.pathname.replace(new RegExp(_opts.state), '') + 
                    _l.search + (_hrefHash() ? '#' + _hrefHash() : '')).replace(_re, '/');
            },
            _hrefHash = function() {
                var index = _l.href.indexOf('#');
                return index != -1 ? _l.href.substr(index + 1) : '';
            },
            _href = function() {
                return _supportsState() ? _hrefState() : _hrefHash();
            },
            _window = function() {
                try {
                    return top.document !== UNDEFINED && top.document.title !== UNDEFINED && top.jQuery !== UNDEFINED && 
                        top.jQuery.address !== UNDEFINED && top.jQuery.address.frames() !== false ? top : window;
                } catch (e) { 
                    return window;
                }
            },
            _js = function() {
                return 'javascript';
            },
            _strict = function(value) {
                value = value.toString();
                return (_opts.strict && value.substr(0, 1) != '/' ? '/' : '') + value;
            },
            _cssint = function(el, value) {
                return parseInt(el.css(value), 10);
            },
            _listen = function() {
                if (!_silent) {
                    var hash = _href(),
                        diff = decodeURI(_value) != decodeURI(hash);
                    if (diff) {
                        if (_msie && _version < 7) {
                            _l.reload();
                        } else {
                            if (_msie && !_hashchange && _opts.history) {
                                _st(_html, 50);
                            }
                            _value = hash;
                            _update(FALSE);
                        }
                    }
                }
            },
            _update = function(internal) {
                _st(_track, 10);
                return _trigger(CHANGE).isDefaultPrevented() || 
                    _trigger(internal ? INTERNAL_CHANGE : EXTERNAL_CHANGE).isDefaultPrevented();
            },
            _track = function() {
                if (_opts.tracker !== 'null' && _opts.tracker !== NULL) {
                    var fn = $.isFunction(_opts.tracker) ? _opts.tracker : _t[_opts.tracker],
                        value = (_l.pathname + _l.search + 
                                ($.address && !_supportsState() ? $.address.value() : ''))
                                .replace(/\/\//, '/').replace(/^\/$/, '');
                    if ($.isFunction(fn)) {
                        fn(value);
                    } else if ($.isFunction(_t.urchinTracker)) {
                        _t.urchinTracker(value);
                    } else if (_t.pageTracker !== UNDEFINED && $.isFunction(_t.pageTracker._trackPageview)) {
                        _t.pageTracker._trackPageview(value);
                    } else if (_t._gaq !== UNDEFINED && $.isFunction(_t._gaq.push)) {
                        _t._gaq.push(['_trackPageview', decodeURI(value)]);
                    } else if ($.isFunction(_t.ga)) {
                        _t.ga('send', 'pageview', value);
                    }
                }
            },
            _html = function() {
                var src = _js() + ':' + FALSE + ';document.open();document.writeln(\'<html><head><title>' + 
                    _d.title.replace(/\'/g, '\\\'') + '</title><script>var ' + ID + ' = "' + encodeURIComponent(_href()).replace(/\'/g, '\\\'') + 
                    (_d.domain != _l.hostname ? '";document.domain="' + _d.domain : '') + 
                    '";</' + 'script></head></html>\');document.close();';
                if (_version < 7) {
                    _frame.src = src;
                } else {
                    _frame.contentWindow.location.replace(src);
                }
            },
            _options = function() {
                if (_url && _qi != -1) {
                    var i, param, params = _url.substr(_qi + 1).split('&');
                    for (i = 0; i < params.length; i++) {
                        param = params[i].split('=');
                        if (/^(autoUpdate|history|strict|wrap)$/.test(param[0])) {
                            _opts[param[0]] = (isNaN(param[1]) ? /^(true|yes)$/i.test(param[1]) : (parseInt(param[1], 10) !== 0));
                        }
                        if (/^(state|tracker)$/.test(param[0])) {
                            _opts[param[0]] = param[1];
                        }
                    }
                    _url = NULL;
                }
                _value = _href();
            },
            _load = function() {
                if (!_loaded) {
                    _loaded = TRUE;
                    _options();
                    $('a[rel*="address:"]').address();
                    if (_opts.wrap) {
                        var body = $('body'),
                            wrap = $('body > *')
                                .wrapAll('<div style="padding:' + 
                                    (_cssint(body, 'marginTop') + _cssint(body, 'paddingTop')) + 'px ' + 
                                    (_cssint(body, 'marginRight') + _cssint(body, 'paddingRight')) + 'px ' + 
                                    (_cssint(body, 'marginBottom') + _cssint(body, 'paddingBottom')) + 'px ' + 
                                    (_cssint(body, 'marginLeft') + _cssint(body, 'paddingLeft')) + 'px;" />')
                                .parent()
                                .wrap('<div id="' + ID + '" style="height:100%;overflow:auto;position:relative;' + 
                                    (_webkit && !window.statusbar.visible ? 'resize:both;' : '') + '" />');
                        $('html, body')
                            .css({
                                height: '100%',
                                margin: 0,
                                padding: 0,
                                overflow: 'hidden'
                            });
                        if (_webkit) {
                            $('<style type="text/css" />')
                                .appendTo('head')
                                .text('#' + ID + '::-webkit-resizer { background-color: #fff; }');
                        }
                    }
                    if (_msie && !_hashchange) {
                        var frameset = _d.getElementsByTagName('frameset')[0];
                        _frame = _d.createElement((frameset ? '' : 'i') + 'frame');
                        _frame.src = _js() + ':' + FALSE;
                        if (frameset) {
                            frameset.insertAdjacentElement('beforeEnd', _frame);
                            frameset[frameset.cols ? 'cols' : 'rows'] += ',0';
                            _frame.noResize = TRUE;
                            _frame.frameBorder = _frame.frameSpacing = 0;
                        } else {
                            _frame.style.display = 'none';
                            _frame.style.width = _frame.style.height = 0;
                            _frame.tabIndex = -1;
                            _d.body.insertAdjacentElement('afterBegin', _frame);
                        }
                        _st(function() {
                            $(_frame).bind('load', function() {
                                var win = _frame.contentWindow;
                                _value = win[ID] !== UNDEFINED ? win[ID] : '';
                                if (_value != _href()) {
                                    _update(FALSE);
                                    _l.hash = _value;
                                }
                            });
                            if (_frame.contentWindow[ID] === UNDEFINED) {
                                _html();
                            }
                        }, 50);
                    }
                    _st(function() {
                        _trigger('init');
                        _update(FALSE);
                    }, 1);
                    if (!_supportsState()) {
                        if ((_msie && _version > 7) || (!_msie && _hashchange)) {
                            if (_t.addEventListener) {
                                _t.addEventListener(HASH_CHANGE, _listen, FALSE);
                            } else if (_t.attachEvent) {
                                _t.attachEvent('on' + HASH_CHANGE, _listen);
                            }
                        } else {
                            _si(_listen, 50);
                        }
                    }
                    if ('state' in window.history) {
                        $(window).trigger('popstate');
                    }
                }
            },
            _popstate = function() {
                if (decodeURI(_value) != decodeURI(_href())) {
                    _value = _href();
                    _update(FALSE);
                }
            },
            _unload = function() {
                if (_t.removeEventListener) {
                    _t.removeEventListener(HASH_CHANGE, _listen, FALSE);
                } else if (_t.detachEvent) {
                    _t.detachEvent('on' + HASH_CHANGE, _listen);
                }
            },
            _uaMatch = function(ua) {
                ua = ua.toLowerCase();
                var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                    /(msie) ([\w.]+)/.exec( ua ) ||
                    ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                    [];
                return {
                    browser: match[ 1 ] || '',
                    version: match[ 2 ] || '0'
                };
            },
            _detectBrowser = function() {
                var browser = {},
                    matched = _uaMatch(navigator.userAgent);
                if (matched.browser) {
                    browser[matched.browser] = true;
                    browser.version = matched.version;
                }
                if (browser.chrome) {
                    browser.webkit = true;
                } else if (browser.webkit) {
                    browser.safari = true;
                }
                return browser;
            },
            UNDEFINED,
            NULL = null,
            ID = 'jQueryAddress',
            STRING = 'string',
            HASH_CHANGE = 'hashchange',
            INIT = 'init',
            CHANGE = 'change',
            INTERNAL_CHANGE = 'internalChange',
            EXTERNAL_CHANGE = 'externalChange',
            TRUE = true,
            FALSE = false,
            _opts = {
                autoUpdate: TRUE, 
                history: TRUE, 
                strict: TRUE,
                frames: TRUE,
                wrap: FALSE
            },
            _browser = _detectBrowser(),
            _version = parseFloat(_browser.version),
            _webkit = _browser.webkit || _browser.safari,
            _msie = !$.support.opacity,
            _t = _window(),
            _d = _t.document,
            _h = _t.history, 
            _l = _t.location,
            _si = setInterval,
            _st = setTimeout,
            _re = /\/{2,9}/g,
            _agent = navigator.userAgent,
            _hashchange = 'on' + HASH_CHANGE in _t,
            _frame,
            _form,
            _url = $('script:last').attr('src'),
            _qi = _url ? _url.indexOf('?') : -1,
            _title = _d.title, 
            _silent = FALSE,
            _loaded = FALSE,
            _juststart = TRUE,
            _updating = FALSE,
            _listeners = {}, 
            _value = _href();
            
        if (_msie) {
            _version = parseFloat(_agent.substr(_agent.indexOf('MSIE') + 4));
            if (_d.documentMode && _d.documentMode != _version) {
                _version = _d.documentMode != 8 ? 7 : 8;
            }
            var pc = _d.onpropertychange;
            _d.onpropertychange = function() {
                if (pc) {
                    pc.call(_d);
                }
                if (_d.title != _title && _d.title.indexOf('#' + _href()) != -1) {
                    _d.title = _title;
                }
            };
        }
        
        if (_h.navigationMode) {
            _h.navigationMode = 'compatible';
        }
        if (document.readyState == 'complete') {
            var interval = setInterval(function() {
                if ($.address) {
                    _load();
                    clearInterval(interval);
                }
            }, 50);
        } else {
            _options();
            $(_load);
        }
        $(window).bind('popstate', _popstate).bind('unload', _unload);

        return {
            bind: function(type, data, fn) {
                return _bind.apply(this, _array(arguments));
            },
            unbind: function(type, fn) {
                return _unbind.apply(this, _array(arguments));
            },
            init: function(data, fn) {
                return _bind.apply(this, [INIT].concat(_array(arguments)));
            },
            change: function(data, fn) {
                return _bind.apply(this, [CHANGE].concat(_array(arguments)));
            },
            internalChange: function(data, fn) {
                return _bind.apply(this, [INTERNAL_CHANGE].concat(_array(arguments)));
            },
            externalChange: function(data, fn) {
                return _bind.apply(this, [EXTERNAL_CHANGE].concat(_array(arguments)));
            },
            baseURL: function() {
                var url = _l.href;
                if (url.indexOf('#') != -1) {
                    url = url.substr(0, url.indexOf('#'));
                }
                if (/\/$/.test(url)) {
                    url = url.substr(0, url.length - 1);
                }
                return url;
            },
            autoUpdate: function(value) {
                if (value !== UNDEFINED) {
                    _opts.autoUpdate = value;
                    return this;
                }
                return _opts.autoUpdate;
            },
            history: function(value) {
                if (value !== UNDEFINED) {
                    _opts.history = value;
                    return this;
                }
                return _opts.history;
            },
            state: function(value) {
                if (value !== UNDEFINED) {
                    _opts.state = value;
                    var hrefState = _hrefState();
                    if (_opts.state !== UNDEFINED) {
                        if (_h.pushState) {
                            if (hrefState.substr(0, 3) == '/#/') {
                                _l.replace(_opts.state.replace(/^\/$/, '') + hrefState.substr(2));
                            }
                        } else if (hrefState != '/' && hrefState.replace(/^\/#/, '') != _hrefHash()) {
                            _st(function() {
                                _l.replace(_opts.state.replace(/^\/$/, '') + '/#' + hrefState);
                            }, 1);
                        }
                    }
                    return this;
                }
                return _opts.state;
            },
            frames: function(value) {
                if (value !== UNDEFINED) {
                    _opts.frames = value;
                    _t = _window();
                    return this;
                }
                return _opts.frames;
            },            
            strict: function(value) {
                if (value !== UNDEFINED) {
                    _opts.strict = value;
                    return this;
                }
                return _opts.strict;
            },
            tracker: function(value) {
                if (value !== UNDEFINED) {
                    _opts.tracker = value;
                    return this;
                }
                return _opts.tracker;
            },
            wrap: function(value) {
                if (value !== UNDEFINED) {
                    _opts.wrap = value;
                    return this;
                }
                return _opts.wrap;
            },
            update: function() {
                _updating = TRUE;
                this.value(_value);
                _updating = FALSE;
                return this;
            },
            title: function(value) {
                if (value !== UNDEFINED) {
                    _st(function() {
                        _title = _d.title = value;
                        if (_juststart && _frame && _frame.contentWindow && _frame.contentWindow.document) {
                            _frame.contentWindow.document.title = value;
                            _juststart = FALSE;
                        }
                    }, 50);
                    return this;
                }
                return _d.title;
            },
            value: function(value) {
                if (value !== UNDEFINED) {
                    value = _strict(value);
                    if (value == '/') {
                        value = '';
                    }
                    if (_value == value && !_updating) {
                        return;
                    }
                    _value = value;
                    if (_opts.autoUpdate || _updating) {
                        if (_update(TRUE)) {
                            return this;
                        }
                        if (_supportsState()) {
                            _h[_opts.history ? 'pushState' : 'replaceState']({}, '', 
                                    _opts.state.replace(/\/$/, '') + (_value === '' ? '/' : _value));
                        } else {
                            _silent = TRUE;
                            if (_webkit) {
                                if (_opts.history) {
                                    _l.hash = '#' + _value;
                                } else {
                                    _l.replace('#' + _value);
                                }
                            } else if (_value != _href()) {
                                if (_opts.history) {
                                    _l.hash = '#' + _value;
                                } else {
                                    _l.replace('#' + _value);
                                }
                            }
                            if ((_msie && !_hashchange) && _opts.history) {
                                _st(_html, 50);
                            }
                            if (_webkit) {
                                _st(function(){ _silent = FALSE; }, 1);
                            } else {
                                _silent = FALSE;
                            }
                        }
                    }
                    return this;
                }
                return _strict(_value);
            },
            path: function(value) {
                if (value !== UNDEFINED) {
                    var qs = this.queryString(),
                        hash = this.hash();
                    this.value(value + (qs ? '?' + qs : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                return _strict(_value).split('#')[0].split('?')[0];
            },
            pathNames: function() {
                var path = this.path(),
                    names = path.replace(_re, '/').split('/');
                if (path.substr(0, 1) == '/' || path.length === 0) {
                    names.splice(0, 1);
                }
                if (path.substr(path.length - 1, 1) == '/') {
                    names.splice(names.length - 1, 1);
                }
                return names;
            },
            queryString: function(value) {
                if (value !== UNDEFINED) {
                    var hash = this.hash();
                    this.value(this.path() + (value ? '?' + value : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                var arr = _value.split('?');
                return arr.slice(1, arr.length).join('?').split('#')[0];
            },
            parameter: function(name, value, append) {
                var i, params;
                if (value !== UNDEFINED) {
                    var names = this.parameterNames();
                    params = [];
                    value = value === UNDEFINED || value === NULL ? '' : value.toString();
                    for (i = 0; i < names.length; i++) {
                        var n = names[i],
                            v = this.parameter(n);
                        if (typeof v == STRING) {
                            v = [v];
                        }
                        if (n == name) {
                            v = (value === NULL || value === '') ? [] : 
                                (append ? v.concat([value]) : [value]);
                        }
                        for (var j = 0; j < v.length; j++) {
                            params.push(n + '=' + v[j]);
                        }
                    }
                    if ($.inArray(name, names) == -1 && value !== NULL && value !== '') {
                        params.push(name + '=' + value);
                    }
                    this.queryString(params.join('&'));
                    return this;
                }
                value = this.queryString();
                if (value) {
                    var r = [];
                    params = value.split('&');
                    for (i = 0; i < params.length; i++) {
                        var p = params[i].split('=');
                        if (p[0] == name) {
                            r.push(p.slice(1).join('='));
                        }
                    }
                    if (r.length !== 0) {
                        return r.length != 1 ? r : r[0];
                    }
                }
            },
            parameterNames: function() {
                var qs = this.queryString(),
                    names = [];
                if (qs && qs.indexOf('=') != -1) {
                    var params = qs.split('&');
                    for (var i = 0; i < params.length; i++) {
                        var name = params[i].split('=')[0];
                        if ($.inArray(name, names) == -1) {
                            names.push(name);
                        }
                    }
                }
                return names;
            },
            hash: function(value) {
                if (value !== UNDEFINED) {
                    this.value(_value.split('#')[0] + (value ? '#' + value : ''));
                    return this;
                }
                var arr = _value.split('#');
                return arr.slice(1, arr.length).join('#');                
            }
        };
    })();
    
    $.fn.address = function(fn) {
        $(this).each(function(index) {
            if (!$(this).data('address')) {
                $(this).on('click', function(e) {
                    if (e.shiftKey || e.ctrlKey || e.metaKey || e.which == 2) {
                        return true;
                    }
                    var target = e.currentTarget;
                    if ($(target).is('a')) {
                        e.preventDefault();
                        var value = fn ? fn.call(target) : 
                            /address:/.test($(target).attr('rel')) ? $(target).attr('rel').split('address:')[1].split(' ')[0] : 
                            $.address.state() !== undefined && !/^\/?$/.test($.address.state()) ? 
                                    $(target).attr('href').replace(new RegExp('^(.*' + $.address.state() + '|\\.)'), '') : 
                                    $(target).attr('href').replace(/^(#\!?|\.)/, '');
                        $.address.value(value);
                    }
                }).on('submit', function(e) {
                    var target = e.currentTarget;
                    if ($(target).is('form')) {
                        e.preventDefault();
                        var action = $(target).attr('action'),
                            value = fn ? fn.call(target) : (action.indexOf('?') != -1 ? action.replace(/&$/, '') : action + '?') + 
                                $(target).serialize();
                        $.address.value(value);
                    }
                }).data('address', true);
            }
        });
        return this;
    };
    
})(jQuery);
/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.6
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);



/*!
 * jQuery Viewport Plugin
 *
 * Date: Jul 29 2011
 *
 * Copyright 2011, Koen Punt / http://www.koenpunt.nl
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
*/

;(function( $ ){
	$.fn.extend({
		
		inViewport: function(){
			var visibleElements = [];
			this.each(function(){
				if($.inViewport(this)){
					visibleElements.push(this);
				}	
			});
			return this.pushStack(visibleElements);
		},
		
		mostVisible: function(){
			var visibleElements = this.inViewport(),
				mostVisible = null,
				highestVisibility = 0;
			
			$.each(visibleElements, function(index, element){
				if(elementVisibility = $(element).data('vpVisibility')){
					if(elementVisibility > highestVisibility){
						highestVisibility = elementVisibility;
						mostVisible = $(element);
					}
				}
			});
		
			return mostVisible;
		}
	});
	
	$.inViewport = function(element){
		var element = $(element),
			scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height(),
			offset = element.offset(),
			elementBottom = offset.top + element.height() - scrollTop,// - 100,
			elementTop = offset.top - scrollTop,// - 100,
			a,b;
			a = elementTop - (windowHeight - element.height()) > element.height() ? element.height() : elementTop - (windowHeight - element.height());
			a = a > 0 ? a : 0;
			b = elementBottom > element.height() ? element.height() : elementBottom;
			b = b > 0 ? b : 0;
			vpVisibility = (b-a) / element.height();
			element.data('vpVisibility', vpVisibility);
		return vpVisibility;
	};
	
})( jQuery );



/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});



/**
 * Within Viewport
 *
 * @description Determines whether an element is completely
 *              within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     0.0.4
 * @date        2014-07-05
 */
;(function() {
    /**
     * Determines whether an element is within the viewport
     * @param  {Object}  elem       DOM Element (required)
     * @param  {Object}  options    Optional settings
     * @return {Boolean}            Whether the element was completely within the viewport
    */
    var withinViewport = function _withinViewport(elem, options) {
        var result = false,
            metadata = {},
            config = {},
            settings, useHtmlElem, isWithin, scrollOffset, elemOffset, arr, i, side;

        if (typeof jQuery !== 'undefined' && elem instanceof jQuery) {
            elem = elem.get(0);
        }

        if (typeof elem !== 'object' || elem.nodeType !== 1) {
            throw new Error('First argument must be an element');
        }

        if (elem.getAttribute('data-withinviewport-settings') && window.JSON) {
            metadata = JSON.parse(elem.getAttribute('data-withinviewport-settings'));
        }

        // Settings argument may be a simple string (`top`, `right`, etc)
        if (typeof options === 'string') {
            settings = {sides: options};
        }
        else {
            settings = options || {};
        }

        // Build configuration from defaults and given settings
        config.container = settings.container || metadata.container || withinViewport.defaults.container || document.body;
        config.sides = settings.sides || metadata.sides || withinViewport.defaults.sides || 'all';
        config.top = settings.top || metadata.top || withinViewport.defaults.top || 0;
        config.right = settings.right || metadata.right || withinViewport.defaults.right || 0;
        config.bottom = settings.bottom || metadata.bottom || withinViewport.defaults.bottom || 0;
        config.left = settings.left || metadata.left || withinViewport.defaults.left || 0;

        // Whether we can use the `<html`> element for `scrollTop`
        // Unfortunately at the moment I can't find a way to do this without UA-sniffing
        useHtmlElem = !/Chrome/.test(navigator.userAgent);

        // Element testing methods
        isWithin = {
            // Element is below the top edge of the viewport
            top: function _isWithin_top() {
                return elemOffset[1] >= scrollOffset[1] + config.top;
            },

            // Element is to the left of the right edge of the viewport
            right: function _isWithin_right() {
                var container = (config.container === document.body) ? window : config.container;

                return elemOffset[0] + elem.offsetWidth <= container.innerWidth + scrollOffset[0] - config.right;
            },

            // Element is above the bottom edge of the viewport
            bottom: function _isWithin_bottom() {
                var container = (config.container === document.body) ? window : config.container;

                return elemOffset[1] + elem.offsetHeight <= scrollOffset[1] + container.innerHeight - config.bottom;
            },

            // Element is to the right of the left edge of the viewport
            left: function _isWithin_left() {
                return elemOffset[0] >= scrollOffset[0] + config.left;
            },

            all: function _isWithin_all() {
                return (isWithin.top() && isWithin.right() && isWithin.bottom() && isWithin.left());
            }
        };

        // Current offset values
        scrollOffset = (function _scrollOffset() {
            var x = config.container.scrollLeft,
                y = config.container.scrollTop;

            if (y === 0) {
                if (config.container.pageYOffset) {
                    y = config.container.pageYOffset;
                }
                else if (window.pageYOffset) {
                    y = window.pageYOffset;
                }
                else {
                    if (config.container === document.body) {
                        if (useHtmlElem) {
                            y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                        }
                        else {
                            y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                        }
                    }
                    else {
                        y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                    }
                }
            }

            if (x === 0) {
                if (config.container.pageXOffset) {
                    x = config.container.pageXOffset;
                }
                else if (window.pageXOffset) {
                    x = window.pageXOffset;
                }
                else {
                    if (config.container === document.body) {
                        x = (config.container.parentElement) ? config.container.parentElement.scrollLeft : 0;
                    }
                    else {
                        x = (config.container.parentElement) ? config.container.parentElement.scrollLeft : 0;
                    }
                }
            }

            return [x, y];
        }());

        elemOffset = (function _elemOffset() {
            var el = elem,
                x = 0,
                y = 0;

            if (el.parentNode) {
                x = el.offsetLeft;
                y = el.offsetTop;

                el = el.parentNode;
                while (el) {
                    if (el == config.container) {
                        break;
                    }

                    x += el.offsetLeft;
                    y += el.offsetTop;

                    el = el.parentNode;
                }
            }

            return [x, y];
        })();

        // Test the element against each side of the viewport that was requested
        arr = config.sides.split(' ');
        i = arr.length;
        while (i--) {
            side = arr[i].toLowerCase();
            if (/top|right|bottom|left|all/.test(side)) {
                if (isWithin[side]()) {
                    result = true;
                }
                else {
                    result = false;
                    // Quit as soon as the first failure is found
                    break;
                }
            }
        }

        return result;
    }; // end of `withinViewport()`

    // Default settings
    withinViewport.prototype.defaults = {
        container: document.body,
        sides: 'all',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    withinViewport.defaults = withinViewport.prototype.defaults;

    // Make function available globally
    window.withinViewport = withinViewport;

    /**
     * Optional enhancements and shortcuts
     *
     * @description Uncomment or comment these pieces as they apply to your project and coding preferences
     */

    // Shortcut methods for each side of the viewport
    // Ex: withinViewport.top(elem) is the same as withinViewport(elem, 'top')
    withinViewport.prototype.top = function _withinViewport_top(element) {
        return withinViewport(element, 'top');
    };

    withinViewport.prototype.right = function _withinViewport_right(element) {
        return withinViewport(element, 'right');
    };

    withinViewport.prototype.bottom = function _withinViewport_bottom(element) {
        return withinViewport(element, 'bottom');
    };

    withinViewport.prototype.left = function _withinViewport_left(element) {
        return withinViewport(element, 'left');
    };
}());
// i18next, v1.7.4
// Copyright (c)2014 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
!function(){function a(a,b){if(!b||"function"==typeof b)return a;for(var c in b)a[c]=b[c];return a}function b(a,c){for(var d in c)d in a?b(a[d],c[d]):a[d]=c[d];return a}function c(a,b,c){var d,e=0,f=a.length,g=void 0===f||"[object Array]"!==Object.prototype.toString.apply(a)||"function"==typeof a;if(c)if(g){for(d in a)if(b.apply(a[d],c)===!1)break}else for(;f>e&&b.apply(a[e++],c)!==!1;);else if(g){for(d in a)if(b.call(a[d],d,a[d])===!1)break}else for(;f>e&&b.call(a[e],e,a[e++])!==!1;);return a}function d(a){return"string"==typeof a?a.replace(/[&<>"'\/]/g,function(a){return O[a]}):a}function e(a){var b=function(a){if(window.XMLHttpRequest)return a(null,new XMLHttpRequest);if(window.ActiveXObject)try{return a(null,new ActiveXObject("Msxml2.XMLHTTP"))}catch(b){return a(null,new ActiveXObject("Microsoft.XMLHTTP"))}return a(new Error)},c=function(a){if("string"==typeof a)return a;var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return b.join("&")},d=function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d))}return b},e=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";a=d(a);var c,e,f,g,h,i,j,k="",l=0;do c=a.charCodeAt(l++),e=a.charCodeAt(l++),f=a.charCodeAt(l++),g=c>>2,h=(3&c)<<4|e>>4,i=(15&e)<<2|f>>6,j=63&f,isNaN(e)?i=j=64:isNaN(f)&&(j=64),k+=b.charAt(g)+b.charAt(h)+b.charAt(i)+b.charAt(j),c=e=f="",g=h=i=j="";while(l<a.length);return k},f=function(){for(var a=arguments[0],b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}return a},g=function(a,d,e,h){"function"==typeof e&&(h=e,e={}),e.cache=e.cache||!1,e.data=e.data||{},e.headers=e.headers||{},e.jsonp=e.jsonp||!1,e.async=void 0===e.async?!0:e.async;var i,j=f({accept:"*/*","content-type":"application/x-www-form-urlencoded;charset=UTF-8"},g.headers,e.headers);if(i="application/json"===j["content-type"]?JSON.stringify(e.data):c(e.data),"GET"===a){var k=[];if(i&&(k.push(i),i=null),e.cache||k.push("_="+(new Date).getTime()),e.jsonp&&(k.push("callback="+e.jsonp),k.push("jsonp="+e.jsonp)),k=k.join("&"),k.length>1&&(d+=d.indexOf("?")>-1?"&"+k:"?"+k),e.jsonp){var l=document.getElementsByTagName("head")[0],m=document.createElement("script");return m.type="text/javascript",m.src=d,l.appendChild(m),void 0}}b(function(b,c){if(b)return h(b);c.open(a,d,e.async);for(var f in j)j.hasOwnProperty(f)&&c.setRequestHeader(f,j[f]);c.onreadystatechange=function(){if(4===c.readyState){var a=c.responseText||"";if(!h)return;h(c.status,{text:function(){return a},json:function(){return JSON.parse(a)}})}},c.send(i)})},h={authBasic:function(a,b){g.headers.Authorization="Basic "+e(a+":"+b)},connect:function(a,b,c){return g("CONNECT",a,b,c)},del:function(a,b,c){return g("DELETE",a,b,c)},get:function(a,b,c){return g("GET",a,b,c)},head:function(a,b,c){return g("HEAD",a,b,c)},headers:function(a){g.headers=a||{}},isAllowed:function(a,b,c){this.options(a,function(a,d){c(-1!==d.text().indexOf(b))})},options:function(a,b,c){return g("OPTIONS",a,b,c)},patch:function(a,b,c){return g("PATCH",a,b,c)},post:function(a,b,c){return g("POST",a,b,c)},put:function(a,b,c){return g("PUT",a,b,c)},trace:function(a,b,c){return g("TRACE",a,b,c)}},i=a.type?a.type.toLowerCase():"get";h[i](a.url,a,function(b,c){200===b||0===b&&c.text()?a.success(c.json(),b,null):a.error(c.text(),b,null)})}function f(a,b){"function"==typeof a&&(b=a,a={}),a=a||{},R.extend(N,a),delete N.fixLng,"string"==typeof N.ns&&(N.ns={namespaces:[N.ns],defaultNs:N.ns}),"string"==typeof N.fallbackNS&&(N.fallbackNS=[N.fallbackNS]),("string"==typeof N.fallbackLng||"boolean"==typeof N.fallbackLng)&&(N.fallbackLng=[N.fallbackLng]),N.interpolationPrefixEscaped=R.regexEscape(N.interpolationPrefix),N.interpolationSuffixEscaped=R.regexEscape(N.interpolationSuffix),N.lng||(N.lng=R.detectLanguage()),J=R.toLanguages(N.lng),D=J[0],R.log("currentLng set to: "+D),N.useCookie&&R.cookie.read(N.cookieName)!==D&&R.cookie.create(N.cookieName,D,N.cookieExpirationTime,N.cookieDomain),N.detectLngFromLocalStorage&&"undefined"!=typeof document&&window.localstorage&&window.localStorage.setItem("i18next_lng",D);var c=x;a.fixLng&&(c=function(a,b){return b=b||{},b.lng=b.lng||c.lng,x(a,b)},c.lng=D),S.setCurrentLng(D),F&&N.setJqueryExt&&q();var d;if(F&&F.Deferred&&(d=F.Deferred()),!N.resStore){var e=R.toLanguages(N.lng);"string"==typeof N.preload&&(N.preload=[N.preload]);for(var f=0,g=N.preload.length;g>f;f++)for(var h=R.toLanguages(N.preload[f]),i=0,j=h.length;j>i;i++)e.indexOf(h[i])<0&&e.push(h[i]);return G.sync.load(e,N,function(a,e){H=e,K=!0,b&&b(c),d&&d.resolve(c)}),d?d.promise():void 0}return H=N.resStore,K=!0,b&&b(c),d&&d.resolve(c),d?d.promise():void 0}function g(a,b){"string"==typeof a&&(a=[a]);for(var c=0,d=a.length;d>c;c++)N.preload.indexOf(a[c])<0&&N.preload.push(a[c]);return f(b)}function h(a,b,c,d){"string"!=typeof b?(c=b,b=N.ns.defaultNs):N.ns.namespaces.indexOf(b)<0&&N.ns.namespaces.push(b),H[a]=H[a]||{},H[a][b]=H[a][b]||{},d?R.deepExtend(H[a][b],c):R.extend(H[a][b],c)}function i(a,b){"string"!=typeof b&&(b=N.ns.defaultNs),H[a]=H[a]||{},H[a][b]={}}function j(a,b,c,d){"string"!=typeof b?(resource=b,b=N.ns.defaultNs):N.ns.namespaces.indexOf(b)<0&&N.ns.namespaces.push(b),H[a]=H[a]||{},H[a][b]=H[a][b]||{};for(var e=c.split(N.keyseparator),f=0,g=H[N.lng][b];e[f];)f==e.length-1?g[e[f]]=d:(null==g[e[f]]&&(g[e[f]]={}),g=g[e[f]]),f++}function k(a,b,c){"string"!=typeof b?(resource=b,b=N.ns.defaultNs):N.ns.namespaces.indexOf(b)<0&&N.ns.namespaces.push(b);for(var d in c)"string"==typeof c[d]&&j(a,b,d,c[d])}function l(a){N.ns.defaultNs=a}function m(a,b){n([a],b)}function n(a,b){var c={dynamicLoad:N.dynamicLoad,resGetPath:N.resGetPath,getAsync:N.getAsync,customLoad:N.customLoad,ns:{namespaces:a,defaultNs:""}},d=R.toLanguages(N.lng);"string"==typeof N.preload&&(N.preload=[N.preload]);for(var e=0,f=N.preload.length;f>e;e++)for(var g=R.toLanguages(N.preload[e]),h=0,i=g.length;i>h;h++)d.indexOf(g[h])<0&&d.push(g[h]);for(var j=[],k=0,l=d.length;l>k;k++){var m=!1,n=H[d[k]];if(n)for(var o=0,p=a.length;p>o;o++)n[a[o]]||(m=!0);else m=!0;m&&j.push(d[k])}j.length?G.sync._fetch(j,c,function(c,d){var e=a.length*j.length;R.each(a,function(a,c){N.ns.namespaces.indexOf(c)<0&&N.ns.namespaces.push(c),R.each(j,function(a,f){H[f]=H[f]||{},H[f][c]=d[f][c],e--,0===e&&b&&(N.useLocalStorage&&G.sync._storeLocal(H),b())})})}):b&&b()}function o(a,b,c){return"function"==typeof b?(c=b,b={}):b||(b={}),b.lng=a,f(b,c)}function p(){return D}function q(){function a(a,b,c){if(0!==b.length){var d="text";if(0===b.indexOf("[")){var e=b.split("]");b=e[1],d=e[0].substr(1,e[0].length-1)}b.indexOf(";")===b.length-1&&(b=b.substr(0,b.length-2));var f;if("html"===d)f=N.defaultValueFromContent?F.extend({defaultValue:a.html()},c):c,a.html(F.t(b,f));else if("text"===d)f=N.defaultValueFromContent?F.extend({defaultValue:a.text()},c):c,a.text(F.t(b,f));else if("prepend"===d)f=N.defaultValueFromContent?F.extend({defaultValue:a.html()},c):c,a.prepend(F.t(b,f));else if("append"===d)f=N.defaultValueFromContent?F.extend({defaultValue:a.html()},c):c,a.append(F.t(b,f));else if(0===d.indexOf("data-")){var g=d.substr("data-".length);f=N.defaultValueFromContent?F.extend({defaultValue:a.data(g)},c):c;var h=F.t(b,f);a.data(g,h),a.attr(d,h)}else f=N.defaultValueFromContent?F.extend({defaultValue:a.attr(d)},c):c,a.attr(d,F.t(b,f))}}function b(b,c){var d=b.attr(N.selectorAttr);if(d||"undefined"==typeof d||d===!1||(d=b.text()||b.val()),d){var e=b,f=b.data("i18n-target");if(f&&(e=b.find(f)||b),c||N.useDataAttrOptions!==!0||(c=b.data("i18n-options")),c=c||{},d.indexOf(";")>=0){var g=d.split(";");F.each(g,function(b,d){""!==d&&a(e,d,c)})}else a(e,d,c);N.useDataAttrOptions===!0&&b.data("i18n-options",c)}}F.t=F.t||x,F.fn.i18n=function(a){return this.each(function(){b(F(this),a);var c=F(this).find("["+N.selectorAttr+"]");c.each(function(){b(F(this),a)})})}}function r(a,b,c,d){if(!a)return a;if(d=d||b,a.indexOf(d.interpolationPrefix||N.interpolationPrefix)<0)return a;var e=d.interpolationPrefix?R.regexEscape(d.interpolationPrefix):N.interpolationPrefixEscaped,f=d.interpolationSuffix?R.regexEscape(d.interpolationSuffix):N.interpolationSuffixEscaped,g="HTML"+f,h=b.replace&&"object"==typeof b.replace?b.replace:b;return R.each(h,function(b,h){var i=c?c+N.keyseparator+b:b;"object"==typeof h&&null!==h?a=r(a,h,i,d):d.escapeInterpolation||N.escapeInterpolation?(a=a.replace(new RegExp([e,i,g].join(""),"g"),R.regexReplacementEscape(h)),a=a.replace(new RegExp([e,i,f].join(""),"g"),R.regexReplacementEscape(R.escape(h)))):a=a.replace(new RegExp([e,i,f].join(""),"g"),R.regexReplacementEscape(h))}),a}function s(a,b){var c=",",d="{",e="}",f=R.extend({},b);for(delete f.postProcess;-1!=a.indexOf(N.reusePrefix)&&(I++,!(I>N.maxRecursion));){var g=a.lastIndexOf(N.reusePrefix),h=a.indexOf(N.reuseSuffix,g)+N.reuseSuffix.length,i=a.substring(g,h),j=i.replace(N.reusePrefix,"").replace(N.reuseSuffix,"");if(g>=h)return R.error("there is an missing closing in following translation value",a),"";if(-1!=j.indexOf(c)){var k=j.indexOf(c);if(-1!=j.indexOf(d,k)&&-1!=j.indexOf(e,k)){var l=j.indexOf(d,k),m=j.indexOf(e,l)+e.length;try{f=R.extend(f,JSON.parse(j.substring(l,m))),j=j.substring(0,k)}catch(n){}}}var o=A(j,f);a=a.replace(i,R.regexReplacementEscape(o))}return a}function t(a){return a.context&&("string"==typeof a.context||"number"==typeof a.context)}function u(a,b){return void 0!==a.count&&"string"!=typeof a.count&&S.needsPlural(b,a.count)}function v(a){return void 0!==a.indefinite_article&&"string"!=typeof a.indefinite_article&&a.indefinite_article}function w(a,b){b=b||{};var c=y(a,b),d=B(a,b);return void 0!==d||d===c}function x(a,b){return b=b||{},K?(I=0,A.apply(null,arguments)):(R.log("i18next not finished initialization. you might have called t function before loading resources finished."),b.defaultValue||"")}function y(a,b){return void 0!==b.defaultValue?b.defaultValue:a}function z(){for(var a=[],b=1;b<arguments.length;b++)a.push(arguments[b]);return{postProcess:"sprintf",sprintf:a}}function A(a,b){if(b&&"object"!=typeof b?"sprintf"===N.shortcutFunction?b=z.apply(null,arguments):"defaultValue"===N.shortcutFunction&&(b={defaultValue:b}):b=b||{},void 0===a||null===a||""===a)return"";"string"==typeof a&&(a=[a]);var c=a[0];if(a.length>1)for(var d=0;d<a.length&&(c=a[d],!w(c,b));d++);var e,f=y(c,b),g=B(c,b),h=b.lng?R.toLanguages(b.lng,b.fallbackLng):J,i=b.ns||N.ns.defaultNs;c.indexOf(N.nsseparator)>-1&&(e=c.split(N.nsseparator),i=e[0],c=e[1]),void 0===g&&N.sendMissing&&"function"==typeof N.missingKeyHandler&&(b.lng?N.missingKeyHandler(h[0],i,c,f,h):N.missingKeyHandler(N.lng,i,c,f,h));var j=b.postProcess||N.postProcess;void 0!==g&&j&&T[j]&&(g=T[j](g,c,b));var k=f;if(f.indexOf(N.nsseparator)>-1&&(e=f.split(N.nsseparator),k=e[1]),k===c&&N.parseMissingKey&&(f=N.parseMissingKey(f)),void 0===g&&(f=r(f,b),f=s(f,b),j&&T[j])){var l=y(c,b);g=T[j](l,c,b)}return void 0!==g?g:f}function B(a,b){b=b||{};var c,d,e=y(a,b),f=J;if(!H)return e;if("cimode"===f[0].toLowerCase())return e;if(b.lng&&(f=R.toLanguages(b.lng,b.fallbackLng),!H[f[0]])){var g=N.getAsync;N.getAsync=!1,G.sync.load(f,N,function(a,b){R.extend(H,b),N.getAsync=g})}var h=b.ns||N.ns.defaultNs;if(a.indexOf(N.nsseparator)>-1){var i=a.split(N.nsseparator);h=i[0],a=i[1]}if(t(b)){c=R.extend({},b),delete c.context,c.defaultValue=N.contextNotFound;var j=h+N.nsseparator+a+"_"+b.context;if(d=x(j,c),d!=N.contextNotFound)return r(d,{context:b.context})}if(u(b,f[0])){c=R.extend({},b),delete c.count,c.defaultValue=N.pluralNotFound;var k=h+N.nsseparator+a+N.pluralSuffix,l=S.get(f[0],b.count);if(l>=0?k=k+"_"+l:1===l&&(k=h+N.nsseparator+a),d=x(k,c),d!=N.pluralNotFound)return r(d,{count:b.count,interpolationPrefix:b.interpolationPrefix,interpolationSuffix:b.interpolationSuffix})}if(v(b)){var m=R.extend({},b);delete m.indefinite_article,m.defaultValue=N.indefiniteNotFound;var n=h+N.nsseparator+a+(b.count&&!u(b,f[0])||!b.count?N.indefiniteSuffix:"");if(d=x(n,m),d!=N.indefiniteNotFound)return d}for(var o,p=a.split(N.keyseparator),q=0,w=f.length;w>q&&void 0===o;q++){for(var z=f[q],C=0,D=H[z]&&H[z][h];p[C];)D=D&&D[p[C]],C++;if(void 0!==D){var E=Object.prototype.toString.apply(D);if("string"==typeof D)D=r(D,b),D=s(D,b);else if("[object Array]"!==E||N.returnObjectTrees||b.returnObjectTrees){if(null===D&&N.fallbackOnNull===!0)D=void 0;else if(null!==D)if(N.returnObjectTrees||b.returnObjectTrees){if("[object Number]"!==E&&"[object Function]"!==E&&"[object RegExp]"!==E){var F="[object Array]"===E?[]:{};R.each(D,function(c){F[c]=A(h+N.nsseparator+a+N.keyseparator+c,b)}),D=F}}else N.objectTreeKeyHandler&&"function"==typeof N.objectTreeKeyHandler?D=N.objectTreeKeyHandler(a,D,z,h,b):(D="key '"+h+":"+a+" ("+z+")' "+"returned an object instead of string.",R.log(D))}else D=D.join("\n"),D=r(D,b),D=s(D,b);"string"==typeof D&&""===D.trim()&&N.fallbackOnEmpty===!0&&(D=void 0),o=D}}if(void 0===o&&!b.isFallbackLookup&&(N.fallbackToDefaultNS===!0||N.fallbackNS&&N.fallbackNS.length>0)){if(b.isFallbackLookup=!0,N.fallbackNS.length){for(var I=0,K=N.fallbackNS.length;K>I;I++)if(o=B(N.fallbackNS[I]+N.nsseparator+a,b)){var L=o.indexOf(N.nsseparator)>-1?o.split(N.nsseparator)[1]:o,M=e.indexOf(N.nsseparator)>-1?e.split(N.nsseparator)[1]:e;if(L!==M)break}}else o=B(a,b);b.isFallbackLookup=!1}return o}function C(){var a,b=[];if("undefined"!=typeof window&&(!function(){for(var a=window.location.search.substring(1),c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("=");if(e>0){var f=c[d].substring(0,e),g=c[d].substring(e+1);b[f]=g}}}(),b[N.detectLngQS]&&(a=b[N.detectLngQS])),!a&&"undefined"!=typeof document&&N.useCookie){var c=R.cookie.read(N.cookieName);c&&(a=c)}return!a&&"undefined"!=typeof document&&window.localstorage&&N.detectLngFromLocalStorage&&(a=window.localStorage.getItem("i18next_lng")),a||"undefined"==typeof navigator||(a=navigator.language?navigator.language:navigator.userLanguage),a||(a=N.fallbackLng[0]),a}Array.prototype.indexOf||(Array.prototype.indexOf=function(a){"use strict";if(null==this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=0;if(arguments.length>0&&(d=Number(arguments[1]),d!=d?d=0:0!=d&&1/0!=d&&d!=-1/0&&(d=(d>0||-1)*Math.floor(Math.abs(d)))),d>=c)return-1;for(var e=d>=0?d:Math.max(c-Math.abs(d),0);c>e;e++)if(e in b&&b[e]===a)return e;return-1}),Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(a){"use strict";if(null==this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=c;arguments.length>1&&(d=Number(arguments[1]),d!=d?d=0:0!=d&&d!=1/0&&d!=-(1/0)&&(d=(d>0||-1)*Math.floor(Math.abs(d))));for(var e=d>=0?Math.min(d,c-1):c-Math.abs(d);e>=0;e--)if(e in b&&b[e]===a)return e;return-1}),"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var D,E=this,F=E.jQuery||E.Zepto,G={},H={},I=0,J=[],K=!1,L={};if("undefined"!=typeof module&&module.exports){if(!F)try{F=require("jquery")}catch(M){}F&&(F.i18n=F.i18n||G),module.exports=G}else F&&(F.i18n=F.i18n||G),E.i18n=E.i18n||G;L={load:function(a,b,c){b.useLocalStorage?L._loadLocal(a,b,function(d,e){for(var f=[],g=0,h=a.length;h>g;g++)e[a[g]]||f.push(a[g]);f.length>0?L._fetch(f,b,function(a,b){R.extend(e,b),L._storeLocal(b),c(null,e)}):c(null,e)}):L._fetch(a,b,function(a,b){c(null,b)})},_loadLocal:function(a,b,c){var d={},e=(new Date).getTime();if(window.localStorage){var f=a.length;R.each(a,function(a,g){var h=window.localStorage.getItem("res_"+g);h&&(h=JSON.parse(h),h.i18nStamp&&h.i18nStamp+b.localStorageExpirationTime>e&&(d[g]=h)),f--,0===f&&c(null,d)})}},_storeLocal:function(a){if(window.localStorage)for(var b in a)a[b].i18nStamp=(new Date).getTime(),window.localStorage.setItem("res_"+b,JSON.stringify(a[b]))},_fetch:function(a,b,c){var d=b.ns,e={};if(b.dynamicLoad){var f=function(a,b){c(null,b)};if("function"==typeof b.customLoad)b.customLoad(a,d.namespaces,b,f);else{var g=r(b.resGetPath,{lng:a.join("+"),ns:d.namespaces.join("+")});R.ajax({url:g,success:function(a){R.log("loaded: "+g),f(null,a)},error:function(a,b,c){R.log("failed loading: "+g),f("failed loading resource.json error: "+c)},dataType:"json",async:b.getAsync})}}else{var h,i=d.namespaces.length*a.length;R.each(d.namespaces,function(d,f){R.each(a,function(a,d){var g=function(a,b){a&&(h=h||[],h.push(a)),e[d]=e[d]||{},e[d][f]=b,i--,0===i&&c(h,e)};"function"==typeof b.customLoad?b.customLoad(d,f,b,g):L._fetchOne(d,f,b,g)})})}},_fetchOne:function(a,b,c,d){var e=r(c.resGetPath,{lng:a,ns:b});R.ajax({url:e,success:function(a){R.log("loaded: "+e),d(null,a)},error:function(a,b,c){if(b&&200==b||a&&a.status&&200==a.status)R.error("There is a typo in: "+e);else if(b&&404==b||a&&a.status&&404==a.status)R.log("Does not exist: "+e);else{var f=b?b:a&&a.status?a.status:null;R.log(f+" when loading "+e)}d(c,{})},dataType:"json",async:c.getAsync})},postMissing:function(a,b,c,d,e){var f={};f[c]=d;var g=[];if("fallback"===N.sendMissingTo&&N.fallbackLng[0]!==!1)for(var h=0;h<N.fallbackLng.length;h++)g.push({lng:N.fallbackLng[h],url:r(N.resPostPath,{lng:N.fallbackLng[h],ns:b})});else if("current"===N.sendMissingTo||"fallback"===N.sendMissingTo&&N.fallbackLng[0]===!1)g.push({lng:a,url:r(N.resPostPath,{lng:a,ns:b})});else if("all"===N.sendMissingTo)for(var h=0,i=e.length;i>h;h++)g.push({lng:e[h],url:r(N.resPostPath,{lng:e[h],ns:b})});for(var j=0,k=g.length;k>j;j++){var l=g[j];R.ajax({url:l.url,type:N.sendType,data:f,success:function(){R.log("posted missing key '"+c+"' to: "+l.url);for(var a=c.split("."),e=0,f=H[l.lng][b];a[e];)f=f[a[e]]=e===a.length-1?d:f[a[e]]||{},e++},error:function(){R.log("failed posting missing key '"+c+"' to: "+l.url)},dataType:"json",async:N.postAsync})}}};var N={lng:void 0,load:"all",preload:[],lowerCaseLng:!1,returnObjectTrees:!1,fallbackLng:["dev"],fallbackNS:[],detectLngQS:"setLng",detectLngFromLocalStorage:!1,ns:"translation",fallbackOnNull:!0,fallbackOnEmpty:!1,fallbackToDefaultNS:!1,nsseparator:":",keyseparator:".",selectorAttr:"data-i18n",debug:!1,resGetPath:"locales/__lng__/__ns__.json",resPostPath:"locales/add/__lng__/__ns__",getAsync:!0,postAsync:!0,resStore:void 0,useLocalStorage:!1,localStorageExpirationTime:6048e5,dynamicLoad:!1,sendMissing:!1,sendMissingTo:"fallback",sendType:"POST",interpolationPrefix:"__",interpolationSuffix:"__",reusePrefix:"$t(",reuseSuffix:")",pluralSuffix:"_plural",pluralNotFound:["plural_not_found",Math.random()].join(""),contextNotFound:["context_not_found",Math.random()].join(""),escapeInterpolation:!1,indefiniteSuffix:"_indefinite",indefiniteNotFound:["indefinite_not_found",Math.random()].join(""),setJqueryExt:!0,defaultValueFromContent:!0,useDataAttrOptions:!1,cookieExpirationTime:void 0,useCookie:!0,cookieName:"i18next",cookieDomain:void 0,objectTreeKeyHandler:void 0,postProcess:void 0,parseMissingKey:void 0,missingKeyHandler:L.postMissing,shortcutFunction:"sprintf"},O={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},P={create:function(a,b,c,d){var e;if(c){var f=new Date;f.setTime(f.getTime()+1e3*60*c),e="; expires="+f.toGMTString()}else e="";d=d?"domain="+d+";":"",document.cookie=a+"="+b+e+";"+d+"path=/"},read:function(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1,e.length);if(0===e.indexOf(b))return e.substring(b.length,e.length)}return null},remove:function(a){this.create(a,"",-1)}},Q={create:function(){},read:function(){return null},remove:function(){}},R={extend:F?F.extend:a,deepExtend:b,each:F?F.each:c,ajax:F?F.ajax:"undefined"!=typeof document?e:function(){},cookie:"undefined"!=typeof document?P:Q,detectLanguage:C,escape:d,log:function(a){N.debug&&"undefined"!=typeof console&&console.log(a)},error:function(a){"undefined"!=typeof console&&console.error(a)},getCountyIndexOfLng:function(a){var b=0;return("nb-NO"===a||"nn-NO"===a)&&(b=1),b},toLanguages:function(a){var b=this.log,c=[],d=N.lngWhitelist||!1,e=function(a){!d||d.indexOf(a)>-1?c.push(a):b("rejecting non-whitelisted language: "+a)};if("string"==typeof a&&a.indexOf("-")>-1){var f=a.split("-");a=N.lowerCaseLng?f[0].toLowerCase()+"-"+f[1].toLowerCase():f[0].toLowerCase()+"-"+f[1].toUpperCase(),"unspecific"!==N.load&&e(a),"current"!==N.load&&e(f[this.getCountyIndexOfLng(a)])}else e(a);for(var g=0;g<N.fallbackLng.length;g++)-1===c.indexOf(N.fallbackLng[g])&&N.fallbackLng[g]&&c.push(N.fallbackLng[g]);return c},regexEscape:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},regexReplacementEscape:function(a){return"string"==typeof a?a.replace(/\$/g,"$$$$"):a}};R.applyReplacement=r;var S={rules:{ach:{name:"Acholi",numbers:[1,2],plurals:function(a){return Number(a>1)}},af:{name:"Afrikaans",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ak:{name:"Akan",numbers:[1,2],plurals:function(a){return Number(a>1)}},am:{name:"Amharic",numbers:[1,2],plurals:function(a){return Number(a>1)}},an:{name:"Aragonese",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ar:{name:"Arabic",numbers:[0,1,2,3,11,100],plurals:function(a){return Number(0===a?0:1==a?1:2==a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5)}},arn:{name:"Mapudungun",numbers:[1,2],plurals:function(a){return Number(a>1)}},ast:{name:"Asturian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ay:{name:"Aymará",numbers:[1],plurals:function(){return 0}},az:{name:"Azerbaijani",numbers:[1,2],plurals:function(a){return Number(1!=a)}},be:{name:"Belarusian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},bg:{name:"Bulgarian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},bn:{name:"Bengali",numbers:[1,2],plurals:function(a){return Number(1!=a)}},bo:{name:"Tibetan",numbers:[1],plurals:function(){return 0}},br:{name:"Breton",numbers:[1,2],plurals:function(a){return Number(a>1)}},bs:{name:"Bosnian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},ca:{name:"Catalan",numbers:[1,2],plurals:function(a){return Number(1!=a)}},cgg:{name:"Chiga",numbers:[1],plurals:function(){return 0}},cs:{name:"Czech",numbers:[1,2,5],plurals:function(a){return Number(1==a?0:a>=2&&4>=a?1:2)}},csb:{name:"Kashubian",numbers:[1,2,5],plurals:function(a){return Number(1==a?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},cy:{name:"Welsh",numbers:[1,2,3,8],plurals:function(a){return Number(1==a?0:2==a?1:8!=a&&11!=a?2:3)}},da:{name:"Danish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},de:{name:"German",numbers:[1,2],plurals:function(a){return Number(1!=a)}},dz:{name:"Dzongkha",numbers:[1],plurals:function(){return 0}},el:{name:"Greek",numbers:[1,2],plurals:function(a){return Number(1!=a)}},en:{name:"English",numbers:[1,2],plurals:function(a){return Number(1!=a)}},eo:{name:"Esperanto",numbers:[1,2],plurals:function(a){return Number(1!=a)}},es:{name:"Spanish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},es_ar:{name:"Argentinean Spanish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},et:{name:"Estonian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},eu:{name:"Basque",numbers:[1,2],plurals:function(a){return Number(1!=a)}},fa:{name:"Persian",numbers:[1],plurals:function(){return 0}},fi:{name:"Finnish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},fil:{name:"Filipino",numbers:[1,2],plurals:function(a){return Number(a>1)}},fo:{name:"Faroese",numbers:[1,2],plurals:function(a){return Number(1!=a)}},fr:{name:"French",numbers:[1,2],plurals:function(a){return Number(a>=2)}},fur:{name:"Friulian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},fy:{name:"Frisian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ga:{name:"Irish",numbers:[1,2,3,7,11],plurals:function(a){return Number(1==a?0:2==a?1:7>a?2:11>a?3:4)}},gd:{name:"Scottish Gaelic",numbers:[1,2,3,20],plurals:function(a){return Number(1==a||11==a?0:2==a||12==a?1:a>2&&20>a?2:3)}},gl:{name:"Galician",numbers:[1,2],plurals:function(a){return Number(1!=a)}},gu:{name:"Gujarati",numbers:[1,2],plurals:function(a){return Number(1!=a)}},gun:{name:"Gun",numbers:[1,2],plurals:function(a){return Number(a>1)}},ha:{name:"Hausa",numbers:[1,2],plurals:function(a){return Number(1!=a)}},he:{name:"Hebrew",numbers:[1,2],plurals:function(a){return Number(1!=a)}},hi:{name:"Hindi",numbers:[1,2],plurals:function(a){return Number(1!=a)}},hr:{name:"Croatian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},hu:{name:"Hungarian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},hy:{name:"Armenian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ia:{name:"Interlingua",numbers:[1,2],plurals:function(a){return Number(1!=a)}},id:{name:"Indonesian",numbers:[1],plurals:function(){return 0}},is:{name:"Icelandic",numbers:[1,2],plurals:function(a){return Number(1!=a%10||11==a%100)}},it:{name:"Italian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ja:{name:"Japanese",numbers:[1],plurals:function(){return 0}},jbo:{name:"Lojban",numbers:[1],plurals:function(){return 0}},jv:{name:"Javanese",numbers:[0,1],plurals:function(a){return Number(0!==a)}},ka:{name:"Georgian",numbers:[1],plurals:function(){return 0}},kk:{name:"Kazakh",numbers:[1],plurals:function(){return 0}},km:{name:"Khmer",numbers:[1],plurals:function(){return 0}},kn:{name:"Kannada",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ko:{name:"Korean",numbers:[1],plurals:function(){return 0}},ku:{name:"Kurdish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},kw:{name:"Cornish",numbers:[1,2,3,4],plurals:function(a){return Number(1==a?0:2==a?1:3==a?2:3)}},ky:{name:"Kyrgyz",numbers:[1],plurals:function(){return 0}},lb:{name:"Letzeburgesch",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ln:{name:"Lingala",numbers:[1,2],plurals:function(a){return Number(a>1)}},lo:{name:"Lao",numbers:[1],plurals:function(){return 0}},lt:{name:"Lithuanian",numbers:[1,2,10],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&(10>a%100||a%100>=20)?1:2)}},lv:{name:"Latvian",numbers:[1,2,0],plurals:function(a){return Number(1==a%10&&11!=a%100?0:0!==a?1:2)}},mai:{name:"Maithili",numbers:[1,2],plurals:function(a){return Number(1!=a)}},mfe:{name:"Mauritian Creole",numbers:[1,2],plurals:function(a){return Number(a>1)}},mg:{name:"Malagasy",numbers:[1,2],plurals:function(a){return Number(a>1)}},mi:{name:"Maori",numbers:[1,2],plurals:function(a){return Number(a>1)}},mk:{name:"Macedonian",numbers:[1,2],plurals:function(a){return Number(1==a||1==a%10?0:1)}},ml:{name:"Malayalam",numbers:[1,2],plurals:function(a){return Number(1!=a)}},mn:{name:"Mongolian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},mnk:{name:"Mandinka",numbers:[0,1,2],plurals:function(a){return Number(1==a?1:2)}},mr:{name:"Marathi",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ms:{name:"Malay",numbers:[1],plurals:function(){return 0}},mt:{name:"Maltese",numbers:[1,2,11,20],plurals:function(a){return Number(1==a?0:0===a||a%100>1&&11>a%100?1:a%100>10&&20>a%100?2:3)}},nah:{name:"Nahuatl",numbers:[1,2],plurals:function(a){return Number(1!=a)}},nap:{name:"Neapolitan",numbers:[1,2],plurals:function(a){return Number(1!=a)}},nb:{name:"Norwegian Bokmal",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ne:{name:"Nepali",numbers:[1,2],plurals:function(a){return Number(1!=a)}},nl:{name:"Dutch",numbers:[1,2],plurals:function(a){return Number(1!=a)}},nn:{name:"Norwegian Nynorsk",numbers:[1,2],plurals:function(a){return Number(1!=a)}},no:{name:"Norwegian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},nso:{name:"Northern Sotho",numbers:[1,2],plurals:function(a){return Number(1!=a)}},oc:{name:"Occitan",numbers:[1,2],plurals:function(a){return Number(a>1)}},or:{name:"Oriya",numbers:[2,1],plurals:function(a){return Number(1!=a)}},pa:{name:"Punjabi",numbers:[1,2],plurals:function(a){return Number(1!=a)}},pap:{name:"Papiamento",numbers:[1,2],plurals:function(a){return Number(1!=a)}},pl:{name:"Polish",numbers:[1,2,5],plurals:function(a){return Number(1==a?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},pms:{name:"Piemontese",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ps:{name:"Pashto",numbers:[1,2],plurals:function(a){return Number(1!=a)}},pt:{name:"Portuguese",numbers:[1,2],plurals:function(a){return Number(1!=a)}},pt_br:{name:"Brazilian Portuguese",numbers:[1,2],plurals:function(a){return Number(1!=a)}},rm:{name:"Romansh",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ro:{name:"Romanian",numbers:[1,2,20],plurals:function(a){return Number(1==a?0:0===a||a%100>0&&20>a%100?1:2)}},ru:{name:"Russian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},sah:{name:"Yakut",numbers:[1],plurals:function(){return 0}},sco:{name:"Scots",numbers:[1,2],plurals:function(a){return Number(1!=a)}},se:{name:"Northern Sami",numbers:[1,2],plurals:function(a){return Number(1!=a)}},si:{name:"Sinhala",numbers:[1,2],plurals:function(a){return Number(1!=a)}},sk:{name:"Slovak",numbers:[1,2,5],plurals:function(a){return Number(1==a?0:a>=2&&4>=a?1:2)}},sl:{name:"Slovenian",numbers:[5,1,2,3],plurals:function(a){return Number(1==a%100?1:2==a%100?2:3==a%100||4==a%100?3:0)}},so:{name:"Somali",numbers:[1,2],plurals:function(a){return Number(1!=a)}},son:{name:"Songhay",numbers:[1,2],plurals:function(a){return Number(1!=a)}},sq:{name:"Albanian",numbers:[1,2],plurals:function(a){return Number(1!=a)}},sr:{name:"Serbian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},su:{name:"Sundanese",numbers:[1],plurals:function(){return 0}},sv:{name:"Swedish",numbers:[1,2],plurals:function(a){return Number(1!=a)}},sw:{name:"Swahili",numbers:[1,2],plurals:function(a){return Number(1!=a)}},ta:{name:"Tamil",numbers:[1,2],plurals:function(a){return Number(1!=a)}},te:{name:"Telugu",numbers:[1,2],plurals:function(a){return Number(1!=a)}},tg:{name:"Tajik",numbers:[1,2],plurals:function(a){return Number(a>1)}},th:{name:"Thai",numbers:[1],plurals:function(){return 0}},ti:{name:"Tigrinya",numbers:[1,2],plurals:function(a){return Number(a>1)}},tk:{name:"Turkmen",numbers:[1,2],plurals:function(a){return Number(1!=a)}},tr:{name:"Turkish",numbers:[1,2],plurals:function(a){return Number(a>1)}},tt:{name:"Tatar",numbers:[1],plurals:function(){return 0}},ug:{name:"Uyghur",numbers:[1],plurals:function(){return 0}},uk:{name:"Ukrainian",numbers:[1,2,5],plurals:function(a){return Number(1==a%10&&11!=a%100?0:a%10>=2&&4>=a%10&&(10>a%100||a%100>=20)?1:2)}},ur:{name:"Urdu",numbers:[1,2],plurals:function(a){return Number(1!=a)}},uz:{name:"Uzbek",numbers:[1,2],plurals:function(a){return Number(a>1)}},vi:{name:"Vietnamese",numbers:[1],plurals:function(){return 0}},wa:{name:"Walloon",numbers:[1,2],plurals:function(a){return Number(a>1)}},wo:{name:"Wolof",numbers:[1],plurals:function(){return 0}},yo:{name:"Yoruba",numbers:[1,2],plurals:function(a){return Number(1!=a)}},zh:{name:"Chinese",numbers:[1],plurals:function(){return 0}}},addRule:function(a,b){S.rules[a]=b},setCurrentLng:function(a){if(!S.currentRule||S.currentRule.lng!==a){var b=a.split("-");S.currentRule={lng:a,rule:S.rules[b[0]]}}},needsPlural:function(a,b){var c,d=a.split("-");return c=S.currentRule&&S.currentRule.lng===a?S.currentRule.rule:S.rules[d[R.getCountyIndexOfLng(a)]],c&&c.numbers.length<=1?!1:1!==this.get(a,b)},get:function(a,b){function c(b,c){var d;if(d=S.currentRule&&S.currentRule.lng===a?S.currentRule.rule:S.rules[b]){var e;e=d.noAbs?d.plurals(c):d.plurals(Math.abs(c));var f=d.numbers[e];return 2===d.numbers.length&&1===d.numbers[0]&&(2===f?f=-1:1===f&&(f=1)),f}return 1===c?"1":"-1"}var d=a.split("-");
return c(d[R.getCountyIndexOfLng(a)],b)}},T={},U=function(a,b){T[a]=b},V=function(){function a(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}function b(a,b){for(var c=[];b>0;c[--b]=a);return c.join("")}var c=function(){return c.cache.hasOwnProperty(arguments[0])||(c.cache[arguments[0]]=c.parse(arguments[0])),c.format.call(null,c.cache[arguments[0]],arguments)};return c.format=function(c,d){var e,f,g,h,i,j,k,l=1,m=c.length,n="",o=[];for(f=0;m>f;f++)if(n=a(c[f]),"string"===n)o.push(c[f]);else if("array"===n){if(h=c[f],h[2])for(e=d[l],g=0;g<h[2].length;g++){if(!e.hasOwnProperty(h[2][g]))throw V('[sprintf] property "%s" does not exist',h[2][g]);e=e[h[2][g]]}else e=h[1]?d[h[1]]:d[l++];if(/[^s]/.test(h[8])&&"number"!=a(e))throw V("[sprintf] expecting number but found %s",a(e));switch(h[8]){case"b":e=e.toString(2);break;case"c":e=String.fromCharCode(e);break;case"d":e=parseInt(e,10);break;case"e":e=h[7]?e.toExponential(h[7]):e.toExponential();break;case"f":e=h[7]?parseFloat(e).toFixed(h[7]):parseFloat(e);break;case"o":e=e.toString(8);break;case"s":e=(e=String(e))&&h[7]?e.substring(0,h[7]):e;break;case"u":e=Math.abs(e);break;case"x":e=e.toString(16);break;case"X":e=e.toString(16).toUpperCase()}e=/[def]/.test(h[8])&&h[3]&&e>=0?"+"+e:e,j=h[4]?"0"==h[4]?"0":h[4].charAt(1):" ",k=h[6]-String(e).length,i=h[6]?b(j,k):"",o.push(h[5]?e+i:i+e)}return o.join("")},c.cache={},c.parse=function(a){for(var b=a,c=[],d=[],e=0;b;){if(null!==(c=/^[^\x25]+/.exec(b)))d.push(c[0]);else if(null!==(c=/^\x25{2}/.exec(b)))d.push("%");else{if(null===(c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b)))throw"[sprintf] huh?";if(c[2]){e|=1;var f=[],g=c[2],h=[];if(null===(h=/^([a-z_][a-z_\d]*)/i.exec(g)))throw"[sprintf] huh?";for(f.push(h[1]);""!==(g=g.substring(h[0].length));)if(null!==(h=/^\.([a-z_][a-z_\d]*)/i.exec(g)))f.push(h[1]);else{if(null===(h=/^\[(\d+)\]/.exec(g)))throw"[sprintf] huh?";f.push(h[1])}c[2]=f}else e|=2;if(3===e)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";d.push(c)}b=b.substring(c[0].length)}return d},c}(),W=function(a,b){return b.unshift(a),V.apply(null,b)};U("sprintf",function(a,b,c){return c.sprintf?"[object Array]"===Object.prototype.toString.apply(c.sprintf)?W(a,c.sprintf):"object"==typeof c.sprintf?V(a,c.sprintf):a:a}),G.init=f,G.setLng=o,G.preload=g,G.addResourceBundle=h,G.addResource=j,G.addResources=k,G.removeResourceBundle=i,G.loadNamespace=m,G.loadNamespaces=n,G.setDefaultNamespace=l,G.t=x,G.translate=x,G.exists=w,G.detectLanguage=R.detectLanguage,G.pluralExtensions=S,G.sync=L,G.functions=R,G.lng=p,G.addPostProcessor=U,G.options=N}();
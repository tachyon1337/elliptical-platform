/*
 * =============================================================
 * jQuery.browser
 * =============================================================
 *
 * replaces the deprecated jQuery.browser that has now been removed from jQuery 1.9+
 *
 *
 * Dependencies:
 * jQuery 2.0 +
 *
 *
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var browser = {};
    browser.mozilla = false;
    browser.webkit = false;
    browser.opera = false;
    browser.msie = false;

    var nAgt = navigator.userAgent;
    browser.name = navigator.appName;
    browser.fullVersion = '' + parseFloat(navigator.appVersion);
    browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

// Opera
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browser.opera = true;
        browser.name = "Opera";
        browser.fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// MSIE
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browser.msie = true;
        browser.name = "Microsoft Internet Explorer";
        browser.fullVersion = nAgt.substring(verOffset + 5);
    }
// Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browser.webkit = true;
        browser.name = "Chrome";
        browser.fullVersion = nAgt.substring(verOffset + 7);
    }
// Safari
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browser.webkit = true;
        browser.name = "Safari";
        browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// Firefox
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browser.mozilla = true;
        browser.name = "Firefox";
        browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// Other
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browser.name = nAgt.substring(nameOffset, verOffset);
        browser.fullVersion = nAgt.substring(verOffset + 1);
        if (browser.name.toLowerCase() === browser.name.toUpperCase()) {
            browser.name = navigator.appName;
        }
    }else if(nAgt.indexOf('Mozilla') !== -1 && nAgt.indexOf('Firefox')===-1){
        browser.msie = true;
        browser.name = "Internet Explorer";
        browser.fullVersion = '11';
    }
// trim the fullVersion string at semicolon/space if present
    if ((ix = browser.fullVersion.indexOf(";")) != -1)
        browser.fullVersion = browser.fullVersion.substring(0, ix);
    if ((ix = browser.fullVersion.indexOf(" ")) != -1)
        browser.fullVersion = browser.fullVersion.substring(0, ix);

    browser.majorVersion = parseInt('' + browser.fullVersion, 10);
    if (isNaN(browser.majorVersion)) {
        browser.fullVersion = '' + parseFloat(navigator.appVersion);
        browser.majorVersion = parseInt(navigator.appVersion, 10);
    }
    browser.version = browser.majorVersion;

    $.browser = $.browser || browser;

    return $;


}));




/*
 * =============================================================
 * jQuery.support
 * =============================================================
 *
 * almost all tests adopted from Modernizr
 *
 *
 *
 * Dependencies:
 * jQuery 2.0+
 *
 *
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var support = {},


        docElement = document.documentElement,

        mod = 'ellipsis',

        modElem = document.createElement(mod),

        mStyle = modElem.style,

        toString = {}.toString,

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),

        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),

        ns = {'svg':'http://www.w3.org/2000/svg'},

        classes = [],

        slice = classes.slice,

        featureName,
        injectElementWithStyles = function (rule, callback, nodes, testnames) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },

        testMediaQuery = function (mq) {

            var matchMedia = window.matchMedia || window.msMatchMedia;
            if (matchMedia) {
                return matchMedia(mq).matches;
            }

            var bool;

            injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function (node) {
                bool = (window.getComputedStyle ?
                    getComputedStyle(node, null) :
                    node.currentStyle)['position'] == 'absolute';
            });

            return bool;

        },



        _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false){
                    return props[i];
                }

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function prefixed(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    }

    function testPropsAll(prop, prefixed, elem) {

        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }



    //touch
    support.touch = testTouch();
    function testTouch() {
        var bool;

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#ellipsis{top:9px;position:absolute}}'].join(''), function (node) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    }

    //canvas
    support.canvas = testCanvas();
    function testCanvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));

    }

    //geolocation
    support.geolocation = testGeolocation();
    function testGeolocation() {
        return 'geolocation' in navigator;
    }

    //history
    support.history = testHistory();
    function testHistory() {
        return !!(window.history && history.pushState);
    }

    //dragdrop
    support.dragdrop = testDragDrop();
    function testDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    }

    //websockets
    support.websockets = testWebSockets();
    function testWebSockets() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    }

    //css3dtransforms
    support.css3dtransforms = testCSSTransform3d();
    function testCSSTransform3d() {
        var ret = !!testPropsAll('perspective');

        if (ret && 'webkitPerspective' in docElement.style) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#ellipsis{left:9px;position:absolute;height:3px;}}', function (node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;

    }

    //video
    support.video = testVideo();
    function testVideo() {
        var elem = document.createElement('video'),
            bool = false;

        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
            }

        } catch (e) {
        }

        return bool;
    }

    //audio
    support.audio = testAudio();
    function testAudio() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');

                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a = ( elem.canPlayType('audio/x-m4a;') ||
                    elem.canPlayType('audio/aac;')).replace(/^no$/, '');
            }
        } catch (e) {
        }

        return bool;
    }

    //localstorage
    support.localstorage = testLocalStorage();
    function testLocalStorage() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    //sessionstorage
    support.sessionstorage = testSessionStorage();
    function testSessionStorage() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    //web workers
    support.webworkers = testWebWorkers();
    function testWebWorkers() {
        return !!window.Worker;
    }

    //application cache
    support.applicationcache = testApplicationCache();
    function testApplicationCache() {
        return !!window.applicationCache;
    }

    //svg
    support.svg = testSVG();
    function testSVG() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    }

    //inline svg
    support.inlinesvg = testInlineSVG();
    function testInlineSVG() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    }

    //svg clip paths
    support.svgclippaths = testSVGClipPaths();
    function testSVGClipPaths() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    }

    //webkit background clip
    support.backgroundclip = testBackgroundClip();
    function testBackgroundClip() {

        if (/Android/.test(navigator.userAgent)) {
            return false;
        }
        var ele = document.createElement("ellipsis");
        var ret = ((typeof ele.style.webkitBackgroundClip !== 'undefined') && ( ele.style.webkitBackgroundClip = 'text'));
        var textSupport = ele.style.webkitBackgroundClip == 'text';
        return textSupport;

    }

    //content editable
    support.contenteditbale = testContentEditable();
    function testContentEditable() {
        return 'contentEditable' in document.documentElement;
    }

    //overflow scrolling
    support.overflowscrolling = testOverflowScrolling();
    function testOverflowScrolling() {
        return testPropsAll('overflowScrolling');
    }

    //css resize
    support.cssresize = testResize();
    function testResize() {
        return testPropsAll('resize');
    }

    //postmessage
    support.postmessage = testPostMessage();
    function testPostMessage() {
        return !!window.postMessage;
    }

    //dataview
    support.dataview = testDataView();
    function testDataView() {
        return (typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype);
    }

    //dataset
    support.dataset = testDataSet();
    function testDataSet() {
        var n = document.createElement("div");
        n.setAttribute("data-a-b", "c");
        return !!(n.dataset && n.dataset.aB === "c");
    }

    //progressbar
    support.progressbar = testProgressBar();
    function testProgressBar() {
        return document.createElement('progress').max !== undefined;
    }

    //meter
    support.meter = testMeter();
    function testMeter() {
        return document.createElement('meter').max !== undefined;
    }

    //filesystem
    support.filesystem = testFilesystem();
    function testFilesystem() {
        return !!prefixed('requestFileSystem', window);
    }

    //filereader
    support.filereader = testFileReader();
    function testFileReader() {
        return !!(window.File && window.FileList && window.FileReader);
    }

    //fullscreen
    support.fullscreen = testFullScreen();
    function testFullScreen() {
        for(var i = 0; i < domPrefixes.length; i++) {
            if( document[domPrefixes[i].toLowerCase() + 'CancelFullScreen']){
                return true;
            }

        }
        return !!document['cancelFullScreen'] || false;
    }

    //cors
    support.cors = testCors();
    function testCors() {
        return !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());
    }

    //battery
    support.battery = testBattery();
    function testBattery() {
        return !!prefixed('battery', navigator);
    }

    //low battery
    support.lowbattery = testLowBattery();
    function testLowBattery() {
        var minLevel = 0.20,
            battery = prefixed('battery', navigator);
        return !!(battery && !battery.charging && battery.level <= minLevel);
    }

    //flexbox
    support.flexbox=testFlexbox();
    function testFlexbox(){
        return testPropsAll('flexWrap');
    }

    //indexedDB
    support.indexeddb=testIndexedDB();
    function testIndexedDB(){
        return !!testPropsAll("indexedDB", window);
    }

    //hsla
    support.hsla=hsla();
    function hsla(){
        setCss('background-color:hsla(120,40%,100%,.5)');
        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    }

    //multiple backgrounds
    support.multiplebgs=multiplebgs();
    function multiplebgs(){
        setCss('background:url(https://),url(https://),red url(https://)');
        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    }

    //css columns
    support.csscolumns=cssColumns();
    function cssColumns(){
        return testPropsAll('columnCount');
    }

    //css reflections
    support.cssreflections=cssReflections();
    function cssReflections(){
        return testPropsAll('boxReflect');
    }


    //form validation
    support.formvalidation = testFormValidation();
    function testFormValidation() {
        var form = document.createElement('form');
        if ( !('checkValidity' in form) ) {
            return false;
        }
        var body = document.body,

            html = document.documentElement,

            bodyFaked = false,

            invaildFired = false,

            input,

            formvalidationapi = true;

        // Prevent form from being submitted
        form.onsubmit = function(e) {
            //Opera does not validate form, if submit is prevented
            if ( !window.opera ) {
                e.preventDefault();
            }
            e.stopPropagation();
        };

        // Calling form.submit() doesn't trigger interactive validation,
        // use a submit button instead
        //older opera browsers need a name attribute
        form.innerHTML = '<input name="modTest" required><button></button>';

        // FF4 doesn't trigger "invalid" event if form is not in the DOM tree
        // Chrome throws error if invalid input is not visible when submitting
        form.style.position = 'absolute';
        form.style.top = '-99999em';

        // We might in <head> in which case we need to create body manually
        if ( !body ) {
            bodyFaked = true;
            body = document.createElement('body');
            //avoid crashing IE8, if background image is used
            body.style.background = "";
            html.appendChild(body);
        }

        body.appendChild(form);

        input = form.getElementsByTagName('input')[0];

        // Record whether "invalid" event is fired
        input.oninvalid = function(e) {
            invaildFired = true;
            e.preventDefault();
            e.stopPropagation();
        };

        //presto Opera does not fully support the validationMessage property
        var formvalidationmessage = !!input.validationMessage;

        // Submit form by clicking submit button
        form.getElementsByTagName('button')[0].click();

        // Don't forget to clean up
        body.removeChild(form);
        bodyFaked && html.removeChild(body);

        return invaildFired;
    }
    support.init=function(){
        var html=$('html');
        html.removeClass('no-js');
        html.addClass('js');
        var tests=['touch','canvas','svg','history','formvalidation','localstorage','sessionstorage','meter','backgroundclip','inlinesvg',
            'svgclippaths','css3dtransforms','video','audio','progressbar','cssresize','postmessage','overflowscrolling','flexbox',
            'indexeddb','hsla','multiplebgs','csscolumns','cssreflections'];

        tests.forEach(function(t){
            support[t] ? html.addClass(t) : html.addClass('no-' + t);
        });

        //old ie
        if($.browser && $.browser.msie){
            if($.browser.majorVersion===6){
                html.addClass('ie6');
            }else if($.browser.majorVersion===7){
                html.addClass('ie7');
            }else if($.browser.majorVersion===8){
                html.addClass('ie8');
            }
        }

    };

    support.stickyFooter=function(){
        if($.browser.msie){
            var stickyFooter=$('.ui-sticky-footer');
            if(stickyFooter[0]){
                stickyFooter.addClass('ns');
            }
        }


    };


    support.init();
    support.stickyFooter();
    $.support = $.support || {};
    $.extend($.support, support);

    return $;

}));




/*
 * =============================================================
 * jQuery.utils
 * =============================================================
 *
 *
 *
 * Dependencies:
 * jQuery 2.0+
 *
 *
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var utils={};
    utils.datetime={

        isDate: function(obj){
            return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
        },

        isLeapYear: function(year){
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },

        getDaysInMonth: function(year, month){
            return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        setToStartOfDay: function(date){
            if (this.isDate(date)) date.setHours(0,0,0,0);
        },

        compareDates: function(a,b){
            // weak date comparison (use setToStartOfDay(date) to ensure correct result)
            return a.getTime() === b.getTime();
        },

        /**
         *
         * @returns {string}
         */
        currentDate: function () {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            return (month + '/' + day + '/' + year);
        }
    };

    utils.array={
        isArray: function(obj){
            return (/Array/).test(Object.prototype.toString.call(obj));
        }
    };

    utils.string={
        dashToCamelCase:function(s){
            return s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        },

        random:function(){
            return Math.floor((Math.random()*100000)+1).toString();
        }
    };

    utils.color={
        rgb2hex: function(rgb){
            if (  rgb.search("rgb") == -1 ) {
                return rgb;
            }
            else if ( rgb == 'rgba(0, 0, 0, 0)' ) {
                return 'transparent';
            }
            else {
                rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
        }
    };

    utils.url={
        /**
         *
         * @param ji {String}
         * @returns {String}
         */
        queryString: function (ji) {
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                if (ft[0] == ji) {
                    return ft[1];
                }
            }
            return null;
        },

        /**
         *
         * @returns {Array}
         */
        queryStringObjectArray: function () {
            var arr = [];
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                if (ft[0] == ji) {
                    return ft[1];
                }
                var obj = {};
                obj.prop = ft[0];
                obj.val = ft[1];
                arr.push(obj);
            }

            return arr;
        },

        /**
         *
         * @returns {Array}
         */
        queryStringFilterArray: function () {
            var arr = [];
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                var obj = {};
                obj.filter = ft[0];
                obj.val = ft[1];
                if (obj.filter != '') {
                    arr.push(obj);
                }

            }

            return arr;
        }
    };

    utils.image={
        /**
         *
         * @param img {Object}
         * @param data {Object}
         * @returns {Object}
         */
        aspectRatio: function (img, data) {
            var width = img.width();
            var height = img.height();
            var aRatio = height / width;
            data.aspectRatio = aRatio;
            if (typeof data.height != 'undefined') {
                data.width = parseInt((1 / aRatio) * data.height);
            } else if (typeof data.width != 'undefined') {
                data.height = parseInt(aRatio * data.width);
            }

            return data;
        }
    };


    $.utils = $.utils || {};
    $.extend($.utils, utils);

    /* String/Number prototypes  */
    String.prototype.toCamelCase=function(){
        return this.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };
    String.prototype.toTitleCase=function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    String.prototype.toPixel = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'px';
        return val;
    };
    Number.prototype.toPixel = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'px';
        return val;
    };
    String.prototype.toFloatPixel = function(){
        var val = this.toString() + 'px';
        return val;
    };
    Number.prototype.toFloatPixel = function(){
        var val = this.toString() + 'px';
        return val;
    };
    String.prototype.toInteger=function(){
        return parseInt(this.replace('px',''),10);
    };
    String.prototype.toMillisecond = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'ms';
        return val;
    };
    Number.prototype.toMillisecond = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'ms';
        return val;
    };



    /**
     * replaces an element's class based on a wildcard pattern
     * @param removals {String}
     * @param additions {String}
     * @returns {Object}
     * @public
     *
     * ex: average rating
     *     $span.alterClass('icon-star-*', 'icon-star-3');
     *     $span.icon-star-2 => $span.icon-star-3
     */
    $.fn.alterClass = function ( removals, additions ) {

        var self = this;

        if ( removals.indexOf( '*' ) === -1 ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
            removals.
                replace( /\*/g, '[A-Za-z0-9-_]+' ).
                split( ' ' ).
                join( '\\s|\\s' ) +
            '\\s', 'g' );

        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });

        return !additions ? self : self.addClass( additions );
    };

    /**
     * extends jQuery 'find' to additionally filter the jQuery object against the selector
     * example uses: querying mutation records
     * @param selector {String}
     * @returns {Object}
     * @public
     */
    $.fn.selfFind = function(selector) {
        return this.find(selector).add(this.filter(selector))
    };

    /**
     * clear select list
     * @param opts
     * @returns {$.fn}
     */
    $.fn.clearSelect=function(opts){
        (typeof opts.defaultOption ==='undefined') ? this.children.remove() : this.children('option:not(:first)').remove();
        return this;

    };

    $.fn.findTextNodes=function(){
        return this.contents().filter(function(){return this.nodeType===3});
    };

    $.fn.findTextNodeDescendants=function(){
        return this.find('*').contents().filter(function(){return this.nodeType===3});
    };

    /**
     *  returns first matched children in an iterative children query as "children"
     * @param selector
     * @returns {*|jQuery|HTMLElement}
     */
    $.fn.closestChildren=function(selector){
        if (!selector || selector === '') {
            return $();
        }
        var result=$();
        this.each(function() {
            var $this = $(this);
            var queue = [];
            queue.push($this);
            while (queue.length > 0) {
                var node = queue.shift();
                var children = node.children();
                for (var i = 0; i < children.length; ++i) {
                    var $child = $(children[i]);
                    if ($child.is(selector)) {
                        result=children;
                        return false;
                    } else {
                        queue.push($child);
                    }
                }
            }
        });

        return result;
    };





    return $;


}));






//platform bootstrapper facade
if(typeof global==='undefined'){
    global=window;
}
global.Platform = global.Platform || {};
global.logFlags = global.logFlags || {};

/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

if (typeof WeakMap === 'undefined') {
  (function() {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key)
          entry[1] = value;
        else
          defineProperty(key, this.name, {value: [key, value], writable: true});
      },
      get: function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
            entry[1] : undefined;
      },
      delete: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        var hasValue = entry[0] === key;
        entry[0] = entry[1] = undefined;
        return hasValue;
      },
      has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
      }
    };

    window.WeakMap = WeakMap;
  })();
}

/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
window.CustomElements = window.CustomElements || {flags:{}};
/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope){

var logFlags = window.logFlags || {};
var IMPORT_LINK_TYPE = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : 'none';

// walk the subtree rooted at node, applying 'find(element, data)' function
// to each element
// if 'find' returns true for 'element', do not search element's subtree
function findAll(node, find, data) {
  var e = node.firstElementChild;
  if (!e) {
    e = node.firstChild;
    while (e && e.nodeType !== Node.ELEMENT_NODE) {
      e = e.nextSibling;
    }
  }
  while (e) {
    if (find(e, data) !== true) {
      findAll(e, find, data);
    }
    e = e.nextElementSibling;
  }
  return null;
}

// walk all shadowRoots on a given node.
function forRoots(node, cb) {
  var root = node.shadowRoot;
  while(root) {
    forSubtree(root, cb);
    root = root.olderShadowRoot;
  }
}

// walk the subtree rooted at node, including descent into shadow-roots,
// applying 'cb' to each element
function forSubtree(node, cb) {
  //logFlags.dom && node.childNodes && node.childNodes.length && console.group('subTree: ', node);
  findAll(node, function(e) {
    if (cb(e)) {
      return true;
    }
    forRoots(e, cb);
  });
  forRoots(node, cb);
  //logFlags.dom && node.childNodes && node.childNodes.length && console.groupEnd();
}

// manage lifecycle on added node
function added(node) {
  if (upgrade(node)) {
    insertedNode(node);
    return true;
  }
  inserted(node);
}

// manage lifecycle on added node's subtree only
function addedSubtree(node) {
  forSubtree(node, function(e) {
    if (added(e)) {
      return true;
    }
  });
}

// manage lifecycle on added node and it's subtree
function addedNode(node) {
  return added(node) || addedSubtree(node);
}

// upgrade custom elements at node, if applicable
function upgrade(node) {
  if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
    var type = node.getAttribute('is') || node.localName;
    var definition = scope.registry[type];
    if (definition) {
      logFlags.dom && console.group('upgrade:', node.localName);
      scope.upgrade(node);
      logFlags.dom && console.groupEnd();
      return true;
    }
  }
}

function insertedNode(node) {
  inserted(node);
  if (inDocument(node)) {
    forSubtree(node, function(e) {
      inserted(e);
    });
  }
}

// TODO(sorvell): on platforms without MutationObserver, mutations may not be
// reliable and therefore attached/detached are not reliable.
// To make these callbacks less likely to fail, we defer all inserts and removes
// to give a chance for elements to be inserted into dom.
// This ensures attachedCallback fires for elements that are created and
// immediately added to dom.
var hasPolyfillMutations = (!window.MutationObserver ||
    (window.MutationObserver === window.JsMutationObserver));
scope.hasPolyfillMutations = hasPolyfillMutations;

var isPendingMutations = false;
var pendingMutations = [];
function deferMutation(fn) {
  pendingMutations.push(fn);
  if (!isPendingMutations) {
    isPendingMutations = true;
    var async = (window.Platform && window.Platform.endOfMicrotask) ||
        setTimeout;
    async(takeMutations);
  }
}

function takeMutations() {
  isPendingMutations = false;
  var $p = pendingMutations;
  for (var i=0, l=$p.length, p; (i<l) && (p=$p[i]); i++) {
    p();
  }
  pendingMutations = [];
}

function inserted(element) {
  if (hasPolyfillMutations) {
    deferMutation(function() {
      _inserted(element);
    });
  } else {
    _inserted(element);
  }
}

// TODO(sjmiles): if there are descents into trees that can never have inDocument(*) true, fix this
function _inserted(element) {
  // TODO(sjmiles): it's possible we were inserted and removed in the space
  // of one microtask, in which case we won't be 'inDocument' here
  // But there are other cases where we are testing for inserted without
  // specific knowledge of mutations, and must test 'inDocument' to determine
  // whether to call inserted
  // If we can factor these cases into separate code paths we can have
  // better diagnostics.
  // TODO(sjmiles): when logging, do work on all custom elements so we can
  // track behavior even when callbacks not defined
  //console.log('inserted: ', element.localName);
  if (element.attachedCallback || element.detachedCallback || (element.__upgraded__ && logFlags.dom)) {
    logFlags.dom && console.group('inserted:', element.localName);
    if (inDocument(element)) {
      element.__inserted = (element.__inserted || 0) + 1;
      // if we are in a 'removed' state, bluntly adjust to an 'inserted' state
      if (element.__inserted < 1) {
        element.__inserted = 1;
      }
      // if we are 'over inserted', squelch the callback
      if (element.__inserted > 1) {
        logFlags.dom && console.warn('inserted:', element.localName,
          'insert/remove count:', element.__inserted)
      } else if (element.attachedCallback) {
        logFlags.dom && console.log('inserted:', element.localName);
        element.attachedCallback();
      }
    }
    logFlags.dom && console.groupEnd();
  }
}

function removedNode(node) {
  removed(node);
  forSubtree(node, function(e) {
    removed(e);
  });
}

function removed(element) {
  if (hasPolyfillMutations) {
    deferMutation(function() {
      _removed(element);
    });
  } else {
    _removed(element);
  }
}

function _removed(element) {
  // TODO(sjmiles): temporary: do work on all custom elements so we can track
  // behavior even when callbacks not defined
  if (element.attachedCallback || element.detachedCallback || (element.__upgraded__ && logFlags.dom)) {
    logFlags.dom && console.group('removed:', element.localName);
    if (!inDocument(element)) {
      element.__inserted = (element.__inserted || 0) - 1;
      // if we are in a 'inserted' state, bluntly adjust to an 'removed' state
      if (element.__inserted > 0) {
        element.__inserted = 0;
      }
      // if we are 'over removed', squelch the callback
      if (element.__inserted < 0) {
        logFlags.dom && console.warn('removed:', element.localName,
            'insert/remove count:', element.__inserted)
      } else if (element.detachedCallback) {
        element.detachedCallback();
      }
    }
    logFlags.dom && console.groupEnd();
  }
}

// SD polyfill intrustion due mainly to the fact that 'document'
// is not entirely wrapped
function wrapIfNeeded(node) {
  return window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node)
      : node;
}

function inDocument(element) {
  var p = element;
  var doc = wrapIfNeeded(document);
  while (p) {
    if (p == doc) {
      return true;
    }
    p = p.parentNode || p.host;
  }
}

function watchShadow(node) {
  if (node.shadowRoot && !node.shadowRoot.__watched) {
    logFlags.dom && console.log('watching shadow-root for: ', node.localName);
    // watch all unwatched roots...
    var root = node.shadowRoot;
    while (root) {
      watchRoot(root);
      root = root.olderShadowRoot;
    }
  }
}

function watchRoot(root) {
  if (!root.__watched) {
    observe(root);
    root.__watched = true;
  }
}

function handler(mutations) {
  //
  if (logFlags.dom) {
    var mx = mutations[0];
    if (mx && mx.type === 'childList' && mx.addedNodes) {
        if (mx.addedNodes) {
          var d = mx.addedNodes[0];
          while (d && d !== document && !d.host) {
            d = d.parentNode;
          }
          var u = d && (d.URL || d._URL || (d.host && d.host.localName)) || '';
          u = u.split('/?').shift().split('/').pop();
        }
    }
    console.group('mutations (%d) [%s]', mutations.length, u || '');
  }
  //
  mutations.forEach(function(mx) {
    //logFlags.dom && console.group('mutation');
    if (mx.type === 'childList') {
      forEach(mx.addedNodes, function(n) {
        //logFlags.dom && console.log(n.localName);
        if (!n.localName) {
          return;
        }
        // nodes added may need lifecycle management
        addedNode(n);
      });
      // removed nodes may need lifecycle management
      forEach(mx.removedNodes, function(n) {
        //logFlags.dom && console.log(n.localName);
        if (!n.localName) {
          return;
        }
        removedNode(n);
      });
    }
    //logFlags.dom && console.groupEnd();
  });
  logFlags.dom && console.groupEnd();
};

var observer = new MutationObserver(handler);

function takeRecords() {
  // TODO(sjmiles): ask Raf why we have to call handler ourselves
  handler(observer.takeRecords());
  takeMutations();
}

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

function observe(inRoot) {
  observer.observe(inRoot, {childList: true, subtree: true});
}

function observeDocument(doc) {
  observe(doc);
}

function upgradeDocument(doc) {
  logFlags.dom && console.group('upgradeDocument: ', (doc.baseURI).split('/').pop());
  addedNode(doc);
  logFlags.dom && console.groupEnd();
}

function upgradeDocumentTree(doc) {
  doc = wrapIfNeeded(doc);
  //console.log('upgradeDocumentTree: ', (doc.baseURI).split('/').pop());
  // upgrade contained imported documents
  var imports = doc.querySelectorAll('link[rel=' + IMPORT_LINK_TYPE + ']');
  for (var i=0, l=imports.length, n; (i<l) && (n=imports[i]); i++) {
    if (n.import && n.import.__parsed) {
      upgradeDocumentTree(n.import);
    }
  }
  upgradeDocument(doc);
}

// exports
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
scope.watchShadow = watchShadow;
scope.upgradeDocumentTree = upgradeDocumentTree;
scope.upgradeAll = addedNode;
scope.upgradeSubtree = addedSubtree;
scope.insertedNode = insertedNode;

scope.observeDocument = observeDocument;
scope.upgradeDocument = upgradeDocument;

scope.takeRecords = takeRecords;

})(window.CustomElements);

/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * Implements `document.registerElement`
 * @module CustomElements
*/

/**
 * Polyfilled extensions to the `document` object.
 * @class Document
*/

(function(scope) {

// imports

if (!scope) {
  scope = window.CustomElements = {flags:{}};
}
var flags = scope.flags;

// native document.registerElement?

var hasNative = Boolean(document.registerElement);
// For consistent timing, use native custom elements only when not polyfilling
// other key related web components features.
var useNative = !flags.register && hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || HTMLImports.useNative);

if (useNative) {

  // stub
  var nop = function() {};

  // exports
  scope.registry = {};
  scope.upgradeElement = nop;

  scope.watchShadow = nop;
  scope.upgrade = nop;
  scope.upgradeAll = nop;
  scope.upgradeSubtree = nop;
  scope.observeDocument = nop;
  scope.upgradeDocument = nop;
  scope.upgradeDocumentTree = nop;
  scope.takeRecords = nop;
  scope.reservedTagList = [];

} else {

  /**
   * Registers a custom tag name with the document.
   *
   * When a registered element is created, a `readyCallback` method is called
   * in the scope of the element. The `readyCallback` method can be specified on
   * either `options.prototype` or `options.lifecycle` with the latter taking
   * precedence.
   *
   * @method register
   * @param {String} name The tag name to register. Must include a dash ('-'),
   *    for example 'x-component'.
   * @param {Object} options
   *    @param {String} [options.extends]
   *      (_off spec_) Tag name of an element to extend (or blank for a new
   *      element). This parameter is not part of the specification, but instead
   *      is a hint for the polyfill because the extendee is difficult to infer.
   *      Remember that the input prototype must chain to the extended element's
   *      prototype (or HTMLElement.prototype) regardless of the value of
   *      `extends`.
   *    @param {Object} options.prototype The prototype to use for the new
   *      element. The prototype must inherit from HTMLElement.
   *    @param {Object} [options.lifecycle]
   *      Callbacks that fire at important phases in the life of the custom
   *      element.
   *
   * @example
   *      FancyButton = document.registerElement("fancy-button", {
   *        extends: 'button',
   *        prototype: Object.create(HTMLButtonElement.prototype, {
   *          readyCallback: {
   *            value: function() {
   *              console.log("a fancy-button was created",
   *            }
   *          }
   *        })
   *      });
   * @return {Function} Constructor for the newly registered type.
   */
  function register(name, options) {
    //console.warn('document.registerElement("' + name + '", ', options, ')');
    // construct a defintion out of options
    // TODO(sjmiles): probably should clone options instead of mutating it
    var definition = options || {};
    if (!name) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('document.registerElement: first argument `name` must not be empty');
    }
    if (name.indexOf('-') < 0) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('document.registerElement: first argument (\'name\') must contain a dash (\'-\'). Argument provided was \'' + String(name) + '\'.');
    }
    // prevent registering reserved names
    if (isReservedTag(name)) {
      throw new Error('Failed to execute \'registerElement\' on \'Document\': Registration failed for type \'' + String(name) + '\'. The type name is invalid.');
    }
    // elements may only be registered once
    if (getRegisteredDefinition(name)) {
      throw new Error('DuplicateDefinitionError: a type with name \'' + String(name) + '\' is already registered');
    }
    // must have a prototype, default to an extension of HTMLElement
    // TODO(sjmiles): probably should throw if no prototype, check spec
    if (!definition.prototype) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('Options missing required prototype property');
    }
    // record name
    definition.__name = name.toLowerCase();
    // ensure a lifecycle object so we don't have to null test it
    definition.lifecycle = definition.lifecycle || {};
    // build a list of ancestral custom elements (for native base detection)
    // TODO(sjmiles): we used to need to store this, but current code only
    // uses it in 'resolveTagName': it should probably be inlined
    definition.ancestry = ancestry(definition.extends);
    // extensions of native specializations of HTMLElement require localName
    // to remain native, and use secondary 'is' specifier for extension type
    resolveTagName(definition);
    // some platforms require modifications to the user-supplied prototype
    // chain
    resolvePrototypeChain(definition);
    // overrides to implement attributeChanged callback
    overrideAttributeApi(definition.prototype);
    // 7.1.5: Register the DEFINITION with DOCUMENT
    registerDefinition(definition.__name, definition);
    // 7.1.7. Run custom element constructor generation algorithm with PROTOTYPE
    // 7.1.8. Return the output of the previous step.
    definition.ctor = generateConstructor(definition);
    definition.ctor.prototype = definition.prototype;
    // force our .constructor to be our actual constructor
    definition.prototype.constructor = definition.ctor;
    // if initial parsing is complete
    if (scope.ready) {
      // upgrade any pre-existing nodes of this type
      scope.upgradeDocumentTree(document);
    }
    return definition.ctor;
  }

  function isReservedTag(name) {
    for (var i = 0; i < reservedTagList.length; i++) {
      if (name === reservedTagList[i]) {
        return true;
      }
    }
  }

  var reservedTagList = [
    'annotation-xml', 'color-profile', 'font-face', 'font-face-src',
    'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'
  ];

  function ancestry(extnds) {
    var extendee = getRegisteredDefinition(extnds);
    if (extendee) {
      return ancestry(extendee.extends).concat([extendee]);
    }
    return [];
  }

  function resolveTagName(definition) {
    // if we are explicitly extending something, that thing is our
    // baseTag, unless it represents a custom component
    var baseTag = definition.extends;
    // if our ancestry includes custom components, we only have a
    // baseTag if one of them does
    for (var i=0, a; (a=definition.ancestry[i]); i++) {
      baseTag = a.is && a.tag;
    }
    // our tag is our baseTag, if it exists, and otherwise just our name
    definition.tag = baseTag || definition.__name;
    if (baseTag) {
      // if there is a base tag, use secondary 'is' specifier
      definition.is = definition.__name;
    }
  }

  function resolvePrototypeChain(definition) {
    // if we don't support __proto__ we need to locate the native level
    // prototype for precise mixing in
    if (!Object.__proto__) {
      // default prototype
      var nativePrototype = HTMLElement.prototype;
      // work out prototype when using type-extension
      if (definition.is) {
        var inst = document.createElement(definition.tag);
        var expectedPrototype = Object.getPrototypeOf(inst);
        // only set nativePrototype if it will actually appear in the definition's chain
        if (expectedPrototype === definition.prototype) {
          nativePrototype = expectedPrototype;
        }
      }
      // ensure __proto__ reference is installed at each point on the prototype
      // chain.
      // NOTE: On platforms without __proto__, a mixin strategy is used instead
      // of prototype swizzling. In this case, this generated __proto__ provides
      // limited support for prototype traversal.
      var proto = definition.prototype, ancestor;
      while (proto && (proto !== nativePrototype)) {
        ancestor = Object.getPrototypeOf(proto);
        proto.__proto__ = ancestor;
        proto = ancestor;
      }
      // cache this in case of mixin
      definition.native = nativePrototype;
    }
  }

  // SECTION 4

  function instantiate(definition) {
    // 4.a.1. Create a new object that implements PROTOTYPE
    // 4.a.2. Let ELEMENT by this new object
    //
    // the custom element instantiation algorithm must also ensure that the
    // output is a valid DOM element with the proper wrapper in place.
    //
    return upgrade(domCreateElement(definition.tag), definition);
  }

  function upgrade(element, definition) {
    // some definitions specify an 'is' attribute
    if (definition.is) {
      element.setAttribute('is', definition.is);
    }
    // make 'element' implement definition.prototype
    implement(element, definition);
    // flag as upgraded
    element.__upgraded__ = true;
    // lifecycle management
    created(element);
    // attachedCallback fires in tree order, call before recursing
    scope.insertedNode(element);
    // there should never be a shadow root on element at this point
    scope.upgradeSubtree(element);
    // OUTPUT
    return element;
  }

  function implement(element, definition) {
    // prototype swizzling is best
    if (Object.__proto__) {
      element.__proto__ = definition.prototype;
    } else {
      // where above we can re-acquire inPrototype via
      // getPrototypeOf(Element), we cannot do so when
      // we use mixin, so we install a magic reference
      customMixin(element, definition.prototype, definition.native);
      element.__proto__ = definition.prototype;
    }
  }

  function customMixin(inTarget, inSrc, inNative) {
    // TODO(sjmiles): 'used' allows us to only copy the 'youngest' version of
    // any property. This set should be precalculated. We also need to
    // consider this for supporting 'super'.
    var used = {};
    // start with inSrc
    var p = inSrc;
    // The default is HTMLElement.prototype, so we add a test to avoid mixing in
    // native prototypes
    while (p !== inNative && p !== HTMLElement.prototype) {
      var keys = Object.getOwnPropertyNames(p);
      for (var i=0, k; k=keys[i]; i++) {
        if (!used[k]) {
          Object.defineProperty(inTarget, k,
              Object.getOwnPropertyDescriptor(p, k));
          used[k] = 1;
        }
      }
      p = Object.getPrototypeOf(p);
    }
  }

  function created(element) {
    // invoke createdCallback
    if (element.createdCallback) {
      element.createdCallback();
    }
  }

  // attribute watching

  function overrideAttributeApi(prototype) {
    // overrides to implement callbacks
    // TODO(sjmiles): should support access via .attributes NamedNodeMap
    // TODO(sjmiles): preserves user defined overrides, if any
    if (prototype.setAttribute._polyfilled) {
      return;
    }
    var setAttribute = prototype.setAttribute;
    prototype.setAttribute = function(name, value) {
      changeAttribute.call(this, name, value, setAttribute);
    }
    var removeAttribute = prototype.removeAttribute;
    prototype.removeAttribute = function(name) {
      changeAttribute.call(this, name, null, removeAttribute);
    }
    prototype.setAttribute._polyfilled = true;
  }

  // https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/
  // index.html#dfn-attribute-changed-callback
  function changeAttribute(name, value, operation) {
    name = name.toLowerCase();
    var oldValue = this.getAttribute(name);
    operation.apply(this, arguments);
    var newValue = this.getAttribute(name);
    if (this.attributeChangedCallback
        && (newValue !== oldValue)) {
      this.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // element registry (maps tag names to definitions)

  var registry = {};

  function getRegisteredDefinition(name) {
    if (name) {
      return registry[name.toLowerCase()];
    }
  }

  function registerDefinition(name, definition) {
    registry[name] = definition;
  }

  function generateConstructor(definition) {
    return function() {
      return instantiate(definition);
    };
  }

  var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  function createElementNS(namespace, tag, typeExtension) {
    // NOTE: we do not support non-HTML elements,
    // just call createElementNS for non HTML Elements
    if (namespace === HTML_NAMESPACE) {
      return createElement(tag, typeExtension);
    } else {
      return domCreateElementNS(namespace, tag);
    }
  }

  function createElement(tag, typeExtension) {
    // TODO(sjmiles): ignore 'tag' when using 'typeExtension', we could
    // error check it, or perhaps there should only ever be one argument
    var definition = getRegisteredDefinition(typeExtension || tag);
    if (definition) {
      if (tag == definition.tag && typeExtension == definition.is) {
        return new definition.ctor();
      }
      // Handle empty string for type extension.
      if (!typeExtension && !definition.is) {
        return new definition.ctor();
      }
    }

    if (typeExtension) {
      var element = createElement(tag);
      element.setAttribute('is', typeExtension);
      return element;
    }
    var element = domCreateElement(tag);
    // Custom tags should be HTMLElements even if not upgraded.
    if (tag.indexOf('-') >= 0) {
      implement(element, HTMLElement);
    }
    return element;
  }

  function upgradeElement(element) {
    if (!element.__upgraded__ && (element.nodeType === Node.ELEMENT_NODE)) {
      var is = element.getAttribute('is');
      var definition = getRegisteredDefinition(is || element.localName);
      if (definition) {
        if (is && definition.tag == element.localName) {
          return upgrade(element, definition);
        } else if (!is && !definition.extends) {
          return upgrade(element, definition);
        }
      }
    }
  }

  function cloneNode(deep) {
    // call original clone
    var n = domCloneNode.call(this, deep);
    // upgrade the element and subtree
    scope.upgradeAll(n);
    // return the clone
    return n;
  }
  // capture native createElement before we override it

  var domCreateElement = document.createElement.bind(document);
  var domCreateElementNS = document.createElementNS.bind(document);

  // capture native cloneNode before we override it

  var domCloneNode = Node.prototype.cloneNode;

  // exports

  document.registerElement = register;
  document.createElement = createElement; // override
  document.createElementNS = createElementNS; // override
  Node.prototype.cloneNode = cloneNode; // override

  scope.registry = registry;

  /**
   * Upgrade an element to a custom element. Upgrading an element
   * causes the custom prototype to be applied, an `is` attribute
   * to be attached (as needed), and invocation of the `readyCallback`.
   * `upgrade` does nothing if the element is already upgraded, or
   * if it matches no registered custom tag name.
   *
   * @method ugprade
   * @param {Element} element The element to upgrade.
   * @return {Element} The upgraded element.
   */
  scope.upgrade = upgradeElement;
}

// Create a custom 'instanceof'. This is necessary when CustomElements
// are implemented via a mixin strategy, as for example on IE10.
var isInstance;
if (!Object.__proto__ && !useNative) {
  isInstance = function(obj, ctor) {
    var p = obj;
    while (p) {
      // NOTE: this is not technically correct since we're not checking if
      // an object is an instance of a constructor; however, this should
      // be good enough for the mixin strategy.
      if (p === ctor.prototype) {
        return true;
      }
      p = p.__proto__;
    }
    return false;
  }
} else {
  isInstance = function(obj, base) {
    return obj instanceof base;
  }
}

// exports
scope.instanceof = isInstance;
scope.reservedTagList = reservedTagList;

// bc
document.register = document.registerElement;

scope.hasNative = hasNative;
scope.useNative = useNative;

})(window.CustomElements);

/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

// import

var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;

// highlander object for parsing a document tree

var parser = {
  selectors: [
    'link[rel=' + IMPORT_LINK_TYPE + ']'
  ],
  map: {
    link: 'parseLink'
  },
  parse: function(inDocument) {
    if (!inDocument.__parsed) {
      // only parse once
      inDocument.__parsed = true;
      // all parsable elements in inDocument (depth-first pre-order traversal)
      var elts = inDocument.querySelectorAll(parser.selectors);
      // for each parsable node type, call the mapped parsing method
      forEach(elts, function(e) {
        parser[parser.map[e.localName]](e);
      });
      // upgrade all upgradeable static elements, anything dynamically
      // created should be caught by observer
      CustomElements.upgradeDocument(inDocument);
      // observe document for dom changes
      CustomElements.observeDocument(inDocument);
    }
  },
  parseLink: function(linkElt) {
    // imports
    if (isDocumentLink(linkElt)) {
      this.parseImport(linkElt);
    }
  },
  parseImport: function(linkElt) {
    if (linkElt.import) {
      parser.parse(linkElt.import);
    }
  }
};

function isDocumentLink(inElt) {
  return (inElt.localName === 'link'
      && inElt.getAttribute('rel') === IMPORT_LINK_TYPE);
}

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

// exports

scope.parser = parser;
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;

})(window.CustomElements);
/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function(scope){

// bootstrap parsing
function bootstrap() {
  // parse document
  CustomElements.parser.parse(document);
  // one more pass before register is 'live'
  CustomElements.upgradeDocument(document);
  // set internal 'ready' flag, now document.registerElement will trigger 
  // synchronous upgrades
  CustomElements.ready = true;
  // async to ensure *native* custom elements upgrade prior to this
  // DOMContentLoaded can fire before elements upgrade (e.g. when there's
  // an external script)
  setTimeout(function() {
    // capture blunt profiling data
    CustomElements.readyTime = Date.now();
    if (window.HTMLImports) {
      CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime;
    }
    // notify the system that we are bootstrapped
    document.dispatchEvent(
      new CustomEvent('WebComponentsReady', {bubbles: true})
    );

    // install upgrade hook if HTMLImports are available
    if (window.HTMLImports) {
      HTMLImports.__importsParsingHook = function(elt) {
        CustomElements.parser.parse(elt.import);
      }
    }
  });
}

// CustomEvent shim for IE
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = function(inType, params) {
    params = params || {};
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
    return e;
  };
  window.CustomEvent.prototype = window.Event.prototype;
}

// When loading at readyState complete time (or via flag), boot custom elements
// immediately.
// If relevant, HTMLImports must already be loaded.
if (document.readyState === 'complete' || scope.flags.eager) {
  bootstrap();
// When loading at readyState interactive time, bootstrap only if HTMLImports
// are not pending. Also avoid IE as the semantics of this state are unreliable.
} else if (document.readyState === 'interactive' && !window.attachEvent &&
    (!window.HTMLImports || window.HTMLImports.ready)) {
  bootstrap();
// When loading at other readyStates, wait for the appropriate DOM event to 
// bootstrap.
} else {
  var loadEvent = window.HTMLImports && !HTMLImports.ready ?
      'HTMLImportsLoaded' : 'DOMContentLoaded';
  window.addEventListener(loadEvent, bootstrap);
}

})(window.CustomElements);

/*
 * =============================================================
 * ellipsis.widget v0.9.1
 * =============================================================
 * Copyright (c) 2014 S. Francis, MIS Interactive
 * Licensed MIT
 *
 *
 * ellipsis extensions of the jQuery UI factory
 * uses the Polymer Platform to create custom elements/web components and creates a "stateful widget instance"
 * of a custom element on the jQuery object
 * other enhancements include: template rendering, animation support, media query support, device support, location support
 *
 * dependencies:
 * jquery widget ui factory
 * ellipsis platform
 * ellipsis utils
 *
 * provider dependencies:
 * dust.js-->template
 * ellipsis animation-->animation support -->transition plugin method for transitions, transforms provider for 3d transforms
 * ellipsis touch--->touch/gesture/media query/device support, jQuery special events for click,hover that trigger corresponding touch gestures
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-utils'),require('ellipsis-platform'),require('./widget.factory'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-utils','ellipsis-platform','./widget.factory'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    //init providers
    var touch_= $.touch || {};
    var transit_= $.transit || {};


    /* extend base prototype public options */
    /* for the most part, we follow a dependency injection/provider pattern for UI factory enhancements */
    var options = {
        $providers:{
            template:window.dust || {},
            device: touch_.device || {},
            mq: touch_.mq || {},
            transforms: transit_.transforms || {},
            location:function(url){window.location=url;},
            utils: $.utils || {}
        },
        $customElements:false,
        mqMaxWidth: $.touch.mqMaxWidth || 1024

    };
    window.ellipsis=window.ellipsis || {};
    $.extend($.Widget.prototype.options, options);

    /* private data store */
    var _data = {
        containerSelector: '[data-role="container"]',
        $containerSelector:'ui-container',
        drawerClass: 'touch-ui-drawer',
        drawerElement:'<div class="touch-ui-drawer"></div>',
        $drawerElement:'<touch-ui-drawer></touch-ui-drawer>',
        touchMenuClass: 'touch-ui-menu',
        touchDropdownClass: 'touch-ui-dropdown',
        menuElement:'<ul class="ui-menu"></ul>',
        $menuElement:'<ui-menu></ui-menu>',
        touchMenuElement:'<ul class="touch-ui-menu"></ul>',
        $touchMenuElement:'<touch-ui-menu></touch-ui-menu>',
        menuClass: 'ui-menu',
        listItem:'li',
        $listItem:'menu-item',
        listItemElement:'<li></li>',
        $listItemElement:'<menu-item></menu-item>',
        dropdownClass: 'ui-dropdown',
        dropdownElement:'<ul class="ui-dropdown"></ul>',
        $dropdownElement:'<ui-dropdown></ui-dropdown>',
        searchClass: 'ui-search',
        searchRole:'[data-role="search"]',
        $searchRole:'[role="search"]',
        overlayElement:'<div data-role="overlay"></div>',
        $overlayElement:'<ui-overlay></ui-overlay>',
        hardwareAcceleratedClass: 'ui-hardware-accelerated',
        leftBoxShadowClass: 'ui-left-box-shadow',
        fixedToggleContainerClass: 'ui-fixed-toggle-container',
        overflowContainerClass: 'ui-overflow-container',
        toggleSelector: '[data-role="toggle"]',
        $toggleSelector:'ui-toggle',
        loadingContainer:'.ui-loading-container',
        loading:'.ui-loading',
        loadingDelay:300,
        modalElement:'<div class="ui-modal"></div>',
        $modalElement:'<ui-modal></ui-modal>',
        modalClass:'ui-modal',
        modal:null,
        modalOpacity:.4,
        modalZIndex:999,
        click:'touchclick',
        hover:'touchhover',
        $elements:['ui-container','ui-overlay','ui-modal','ui-menu','menu-item','ui-brand','ui-search','ui-toggle','ui-collapse',
                'menu-item-dropdown','menu-item-search','menu-divider','grid-row','grid-columns',
                'ui-select','ui-input-addon','ui-input-icon','ui-loading','ui-notification','ui-slide-notification',
                'ui-flex-grid','grid-item','ui-flex-table',
                'ui-dropdown','ui-media-object','ui-box','ui-breadcrumb','breadcrumb-item','ui-menu-tab','ui-flex-list','ui-flex-gallery',
                'ui-flex-form','form-item','ui-badge','ui-semantic-label','ui-semantic-checkbox','ui-social','social-icon','ui-flex-container',
                'touch-ui-drawer','touch-ui-menu','touch-ui-dropdown','touch-ui-toggle','touch-ui-brand']

    };

    $.Widget.prototype._data = $.Widget.prototype._data || {};
    $.extend($.Widget.prototype._data, _data);



    /* private -------------------------------------------------------------------------------------------------------*/

    /**
     * use _getCreateEventData as a 'reserved hook' to bind the internal store to the instance
     * @private
     */
    $.Widget.prototype._getCreateEventData= function(){
        this._data=$.widget.extend({},this._data);
        //set our own data store record of an instance
        $.data(this.element[0],'custom-' + this.widgetName,this.widgetName);


        /* fire this to hook the original method */
        this._onCreateEventData();
    };


    /**
     * replaces _getCreateEventData for the instance method hook
     * @private
     */
    $.Widget.prototype._onCreateEventData= $.noop;


    /* expose an animation method for widget animations/transitions */
    /**
     *
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._transitions = function (element, options, callback) {
        options = options || {};
        if (options === {}) {
            options.duration = 300;
            options.preset = 'fadeIn';
        }
        if(options.preset==='none'){
            element.hide();
            return;
        }
        element.transition(options, function () {
            if (callback) {
                callback.call(element[ 0 ]);
            }
        });
    };

    /* expose render method for templates */
    /**
     *
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._render = function (element, options, callback) {
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html=out;
            element.html(html);
            if (callback) {
                callback(err, html);
            }
        });
    };

    /**
     * method that returns parsed html from a rendered template(however, does not insert it into an element like 'render')
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._renderTemplate = function (options, callback) {
        options.parse=(options.parse !== undefined) ? options.parse : true;
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html=out;
            var parsedHtml= (options.parse) ? $.parseHTML(html) : html;
            if (callback) {
                callback(err, parsedHtml);
            }
        });
    };

    /**
     * renders a ui-template element fragment
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._renderFragment = function (element, options, callback) {
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html=out.replace(/<ui-template(.*?)>/g,'').replace(/<\/ui-template>/g,'');
            element.html(html);
            if (callback) {
                callback(err, html);
            }
        });
    };

    function parseTemplateContext(options,provider){
        if (provider === null) {
            throw new Error('Error: render requires a template provider to be set');
        }
        if (typeof options === 'undefined') {
            throw new Error('Error: render requires an options object');
        }
        if (typeof options.template === 'undefined' && typeof options.templateStr ==='undefined') {
            throw new Error('Error: template name or template string is required');
        }
        options.model = options.model || {};
        var context={};
        (options.context) ? context[options.context]=options.model : context=options.model;
        return context;
    }

    function templateReference(opts,$provider){
        if(opts.template){
            return opts.template
        }else if(opts.templateStr){
            var name='str_' + rndString(8);
            var compiled = $provider.compile(opts.templateStr, name);
            $provider.loadSource(compiled);

            return name;
        }else{
            return null;
        }
    }

    function rndString(length){
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /**
     * converts a string into a html document
     * @param htmlString {String}
     * @returns {HTMLDocument}
     * @private
     */
    $.Widget.prototype._DOMParser=function(htmlString){
        return new DOMParser().parseFromString(htmlString, 'text/html');

    };

    /*key-value session store */
    /**
     * get value
     * @param key {String}
     * @returns {Object}
     * @private
     */
    $.Widget.prototype._getData = function (key) {
        return sessionStorage.getItem(key);
    };

    /**
     * set key/value
     * @param key {String}
     * @param val {Object}
     * @private
     */
    $.Widget.prototype._setData = function (key, val) {
        sessionStorage.setItem(key, val);
    };



    $.Widget.prototype._utils=$.Widget.prototype.options.$providers.utils || {};

    /**
     * private method that returns screen mode
     * @returns {string}
     * @private
     */
    $.Widget.prototype._mode = function () {
        return (this._support.device.viewport.width > this.options.mqMaxWidth) ? "desktop" : "touch";
    };



    /**
     *
     * @param obj {Object}
     * @returns {Object}
     * @private
     */
    $.Widget.prototype._offset=function(obj){
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return{
            top:curtop,
            left:curleft
        }
    };

    /**
     * preload images from element
     * @param element {Object}
     * @param callback {Function}
     * @returns {boolean}
     * @private
     */
    $.Widget.prototype._preloadImages = function (element, callback) {
        var imgArray = [];
        var err = {};
        var data = {};
        var images = element.find('img').not('[data-src]');
        var length = images.length;
        var counter = 0;
        if (length === 0) {
            if (callback) {
                err.message = 'No images found in element';
                callback(err, null);
            }
            return false;
        }
        $.each(images, function (i, img) {
            var image = new Image();
            $(image).bind('load', function (event) {
                counter++;
                imgArray.push(image);
                if (counter === length) {
                    if (callback) {
                        data.images = imgArray;
                        data.length = counter;
                        callback(null, data);
                    }
                }
            });
            image.src = img.src;
        });
        return true;
    };


    /**
     *
     * @param evt {String}
     * @param data {Object}
     * @private
     */
    $.Widget.prototype._onEventTrigger = function (evt, data) {
        var event = $.Event(evt);

        this._trigger(evt, event, data);
        //this.element.trigger(evt,data);
        //$(window).trigger(evt,data);
    };

    /**
     * scrollTop event dispatcher
     * @param ypos {Number}
     * @param evt {String}
     * @private
     */
    $.Widget.prototype._scrollTop= function (ypos, evt) {
        if ($.type(ypos) !== "number") {
            ypos = 0;
        } else if (typeof evt === 'undefined') {
            evt = 'scrollTop';
        }

        setTimeout(function () {
            window.scrollTo(0, ypos);
            $(document).trigger(evt, { x: 0, y: ypos });
        }, 20);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._setHardwareAcceleration = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        this._data.toggleAcceleration =provider.setHardwareAcceleration(element,this._data.hardwareAcceleratedClass);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._resetHardwareAcceleration = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetHardwareAcceleration(element,this._data.toggleAcceleration,this._data.hardwareAcceleratedClass);
    };

    $.Widget.prototype._setContainerOverflow = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        this._data.toggleOverflow=provider.setContainerOverflow(element,this._data.overflowContainerClass);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._resetContainerOverflow = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetContainerOverflow(element,this._data.overflowContainerClass);
    };

    /**
     *
     * @param container {object}
     * @private
     */
    $.Widget.prototype._resetContainer = function (container) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetContainer(container,this._data.leftBoxShadowClass,this._data.fixedToggleContainerClass);
    };


    /**
     *
     * @param element {object}
     * @private
     */
    $.Widget.prototype._resetTransition = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetTransition(element);
    };

    /**
     *
     * @param element {object}
     * @private
     */
    $.Widget.prototype._resetTransform = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetTransform(element);
    };

    /**
     *
     * @param element {Object}
     * @param coordinates {Object}
     * @private
     */
    $.Widget.prototype._transform = function (element, coordinates) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.transform(element,coordinates);

    };

    /**
     *
     * @param element {object}
     * @param opts {object}
     * @param callback {function}
     * @private
     */
    $.Widget.prototype._3dTransition = function (element, opts, callback) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.transition3d(element,opts,callback);

    };

    /**
     * requestAnimationFrame wrapper
     * @type {window.requestAnimationFrame|*|Function}
     * @private
     */
    $.Widget.prototype._requestAnimationFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / 60);
        }
        );



    /**
     * binds a touch gesture as a jquery object to the passed element
     * @param element {object}
     * @param obj (object}
     * @returns {object}
     * @private
     */
    $.Widget.prototype._touch = function (element,obj) {
        return element.touch(obj);
    };


    /**
     * queryable device info & media queries attached to the instance
     *
     * @private
     */
    $.Widget.prototype._support = Object.defineProperties({}, {
        'device':{
            get:function(){
                return $.Widget.prototype.options.$providers.device;
            },
            configurable: false
        },

        'mq':{
            get:function(){
                return $.Widget.prototype.options.$providers.mq;
            },
            configurable: false
        }
    });


    /**
     * @param opts {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._loadTemplate = function (opts,callback) {
        throw new Error('Load Template method not implemented for this widget');
    };

    /**
     * add modal overlay
     * @param element {Object}
     * @param opts {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._setModal = function (element,opts,callback) {
        var div=$('<div class="ui-modal"></div>');
        if(opts.cssClass){
            div.addClass(opts.cssClass);
        }

        if(opts.zIndex){
            div.css({
                'z-index':opts.zIndex
            });
        }
        this._data.modal=div;
        var opacity=(opts.opacity) ? opts.opacity : this._data.modalOpacity;
        div.css({
            opacity:0
        });
        element.append(div);

        this._transitions(div,{
            opacity:opacity,
            duration:250
        },function(){
            if(callback){
                callback();
            }
        });
    };

    /**
     * remove modal
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._removeModal = function (callback) {
        var self=this;
        var modal=this._data.modal;
        if(!modal || modal===undefined ){
            return;
        }
        this._transitions(modal,{
            opacity:0,
            duration:250
        },function(){
            modal.remove();
            self._data.modal=null;
            if(callback){
                callback();
            }
        });
    };

    /**
     * overwrite the jQuery UI _trigger method because 'name.event' more expressive than the run-on 'nameevent'
     * event subscribing:'widgetName + '.' + type;  'window.show', as opposed to 'windowshow'
     * @param type {String}
     * @param event {Object}
     * @param data {Object}
     * @returns {boolean}
     * @private
     */
    $.Widget.prototype._trigger=function( type, event, data ) {
        var prop, orig,
            callback = this.options[ type ];

        data = data || {};
        event = $.Event( event );
        event.type = ( type === this.widgetEventPrefix ?
            type :
            this.widgetEventPrefix + '.' + type ).toLowerCase();
        // the original event may come from any element
        // so we need to reset the target on the new event
        event.target = this.element[ 0 ];

        // copy original event properties over to the new event
        orig = event.originalEvent;
        if ( orig ) {
            for ( prop in orig ) {
                if ( !( prop in event ) ) {
                    event[ prop ] = orig[ prop ];
                }
            }
        }

        this.element.trigger( event, data );
        return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
    };

    /**
     * location handler
     * @param url {String}
     * @private
     */
    $.Widget.prototype._location=function(url){
        var fn=$.Widget.prototype.options.$providers.location;
        fn(url);
    };

    /**
     * registers custom tag as an custom element
     * @param tag {String}
     * @param ElementProto {Object}
     * @private
     */
    $.Widget.prototype._registerElement=function(tag,ElementProto){
        if(typeof ElementProto ==='undefined'){
            ElementProto=HTMLElement.prototype;
            ElementProto._name='HTMLElement';
        }
        var proto=Object.create(ElementProto);
        var object_={prototype:proto};

        /* register the element */
        if(ElementProto._name==='HTMLElement'){
            document.register(tag,object_);
        }else{
            object_=getExtendedObject(ElementProto._name,object_);
            document.register(tag,object_);
        }

    };

    /**
     * registers an array of custom tags as custom elements
     * @param arr (ofString or ofObject) object={name,prototype)
     * @private
     */
    $.Widget.prototype._registerElements=function(arr){

        if(typeof arr==='string'){ //support simple passing of a string
            $.Widget.prototype._registerElement(arr);
        }else{
            if(arr.length>0){
                arr.forEach(function(t){
                    (typeof t==='string') ? $.Widget.prototype._registerElement(t) : $.Widget.prototype._registerElement(t.name, t.prototype);
                });
            }
        }
    };

    $.Widget.prototype._instantiated=function(element,name){
        return(name=== $.data(element,'custom-' + name));
    };

    $.Widget.prototype._getAttrs=function(element,camelCase){
        return $.widget.getOpts(element,camelCase);
    }


    /* public --------------------------------------------------------------------------------------------------------*/


    /**
     *
     * @param opts {object} opts.model,opts.template
     * @param callback {function}
     * @public
     */
    $.Widget.prototype.loadTemplate = function (opts, callback) {
        this._loadTemplate(opts, function (err, out) {
            if (callback) {
                callback(err, out);
            }
        });
    };

    /**
     *
     * @param options {object}
     * @public
     */
    $.Widget.prototype.setOptions = function (options) {
        this._setOptions(options);
    };


    /* replace show,hide with css3 transitions */
    $.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
        $.Widget.prototype[ "_" + method ] = function (element, options, callback) {
            var _event = (options) ? options.event : null;
            if (typeof options === "string") {
                options = { effect: options };
            }
            var hasOptions,
                effectName = !options ?
                    method :
                        options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay);
            }

            if (!options.duration) {
                options.duration = 300; //default value
            }

            //we are using our own CSS3 Transitions/animations implementation instead of jQuery UI Effects

            var obj = {};
            obj.duration = options.duration;
            obj.preset = options.effect;

            //test for css3 support; if not, then on 'show' or 'hide', just call the jquery methods
            if ($('html').hasClass('no-css3dtransforms') || options.effect === 'none') {
                if (_event === 'show') {
                    element.show();
                    if (callback) {
                        callback();

                    }
                } else if (_event === 'hide') {
                    element.hide();
                    if (callback) {
                        callback();

                    }
                }

            } else {
                this._transitions(element, obj, callback);
            }
        };
    });

    /**
     * expose render
     * @param element {Object}
     * @param opts {Object}
     * @param callback {Function}
     */
    $.widget.render=function(element,opts,callback){
        $.Widget.prototype._render(element,opts,callback);
    };


    /**
     * getters & setters for widget providers
     *
     */
    $.widget.$providers=function(opts){
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                $.Widget.prototype.options.$providers[key]=opts[key];
            }
        }
    };

    /**
     * getter/setter
     * @type {{options: void}}
     */
    $.widget.config={
        options:Object.defineProperties({}, {
            'mqMaxWidth':{
                get: function () {
                    return  $.Widget.prototype.options.mqMaxWidth;
                },
                set:function(val){
                    $.Widget.prototype.options.mqMaxWidth=val;

                }
            }
        })
    };

    /**
     * custom element info object
     * @returns {{Selector: string, customElements: boolean}}
     */
    $.widget.customElementsObj=function(){
        var Selector_='[data-ui]';
        var customElements=false;
        if($('html').hasClass('customelements')){
            Selector_='ui-element';
            customElements=true;
        }
        return {
            Selector:Selector_,
            customElements:customElements
        }
    };

    /**
     * mutation observer handler
     * parse mutations for widget/element instantiations
     * @param mutations {Array}
     */
    $.widget.onMutation=function(mutations){
        /* support data-ui and ui-element */
        var _custom= $.widget.customElementsObj();
        var Selector_=_custom.Selector;
        var customElements=_custom.customElements;

        /* pass along to any registered listeners */
        $(document).trigger('ellipsis.onMutation',{mutations:mutations});

        mutations.forEach(function (mutation) {
            var added=mutation.addedNodes;
            var removed=mutation.removedNodes;
            if(added.length>0){
                //look for ui-elements
                discoverUIElements(added,Selector_,customElements);
                //look for custom definition elements
                discoverCustomDefinitionElements(added);

            }else if(removed.length>0){
                try{
                    $(document).tooltip('remove',removed);
                }catch(ex){

                }
            }
        });
    };

    /**
     *
     * @param added {Array}
     * @param Selector {String}
     * @param customElements {Boolean}
     * @param doc {Boolean}
     */
    function discoverUIElements(added,Selector,customElements,doc){
        var ui=(doc) ? $(added).find(Selector) : $(added).selfFind(Selector);
        if(ui && ui.length >0){
            $.widget.instantiateUIElements(ui,customElements);
        }
    }

    /**
     *
     * @param added {Array}
     * @param doc {Boolean}
     */
    function discoverCustomDefinitionElements(added,doc){
        var definitions= $.widget.definitions;
        if(definitions && definitions.length){
            definitions.forEach(function(obj){
                var elements=(doc) ? $(added).find(obj.tagName) : $(added).selfFind(obj.tagName);
                if(elements && elements.length >0){
                    $.widget.instantiateCustomDefinitionElements(elements,obj.name);
                }
            });
        }
    }


    /**
     * instantiate custom ui-elements from queried jQuery array
     * @param ui {Array}
     * @param customElements {Boolean}
     */
    $.widget.instantiateUIElements=function(ui,customElements){
        $.each(ui,function(){
            var widget=(customElements) ? $(this).attr('name') : $(this).attr('data-ui');
            if(widget !==undefined){
                widget=widget.toCamelCase();
            }
            var camelCase =(customElements) ? $(this).attr('camel-case') : $(this).attr('data-camel-case');
            if(camelCase===undefined){
                camelCase=true;
            }
            var opts=getOpts(this,camelCase);
            if(opts.name){
                delete opts.name;
            }
            if(opts.ui){
                delete opts.ui;
            }
            if(widget !==undefined && !$.widget.instantiated(this,widget)){
                $(this)[widget](opts);
            }

        });
    };

    /**
     *
     * @param elements {Array}
     * @param name {String}
     */
    $.widget.instantiateCustomDefinitionElements=function(elements,name){
        $.each(elements,function(index,element){
            var camelCase =$(this).attr('camel-case');
            if(camelCase===undefined){
                camelCase=true;
            }
            //check not already instantiated
            var isInstantiated= $.widget.instantiated(element,name);
            if(!isInstantiated){
                var opts=getOpts(element,camelCase);
                $(element)[name](opts);
            }
        });
    };

    /**
     * custom definitions array reference
     * @type {Array}
     */
    $.widget.definitions=[];

    /**
     * register the element as a custom element (depends on Platform which polyfills document.register)
     * @param name {String}
     * @param tagName {String}
     * @param ElementProto {Object}
     * @param registerDef {Boolean}
     */
    $.widget.register=function(name,tagName,ElementProto,registerDef){
        //record the element definition
        var regElement_={};
        regElement_.name=name;
        regElement_.tagName=tagName;

        if(registerDef===undefined){
            registerDef=true;
        }

        //define the object
        var proto=Object.create(ElementProto);
        var object_={prototype:proto};

        /* custom element callbacks
        *  pass them onto the element instance, where the UI factory can hook into them
        * */
        proto.attachedCallback=function(){
            if(this._attachedCallback){
                this._attachedCallback();
            }
        };

        proto.detachedCallback=function(){
            if(this._detachedCallback){
                this._detachedCallback();
            }
        };

        proto.attributeChangedCallback= function(n,o,v){
            if(this._attributeChangedCallback){
                this._attributeChangedCallback(n,o,v);
            }
        };

        /* register the element */
        if(ElementProto._name==='HTMLElement'){
            document.register(tagName,object_);
        }else{
            regElement_.tagName='[is="' + tagName + '"]';
            object_=getExtendedObject(ElementProto._name,object_);
            document.register(tagName,object_);
        }

        if(registerDef){
            $.widget.definitions.push(regElement_);
        }


    };



    /**
     *
     * @param element {Object}
     * @param name {String}
     * @returns {boolean}
     */
    $.widget.instantiated=function(element,name){

        return(name=== $.data(element,'custom-' + name));

    };

    /**
     * register a custom tag as a custom element
     * @param tag
     * @param ElementProto
     */
    $.widget.registerElement=function(tag,ElementProto){
        $.Widget.prototype._registerElement(tag,ElementProto);
    };

    /**
     * register an array of custom tags as custom elements
     * @param arr
     */
    $.widget.registerElements=function(arr){
        $.Widget.prototype._registerElements(arr);
    };

    /**
     * registers the ellipsis css components as custom elements
     */
    $.widget.registerFrameworkElements=function(){
        var arr= $.Widget.prototype._data.$elements;
        arr.forEach(function(t){
            $.widget.registerElement(t);
        });
    };

    /**
     * registers template custom elements
     */
    $.widget.registerTemplateElements=function(){
        $.widget.registerElement('ui-template');
        $.widget.registerElement('ui-model');
    };


    /**
     *
     * @param element {Object}
     * @param camelCase {Boolean}
     * @returns {Object}
     */
    function getOpts(element,camelCase){
        if(camelCase===undefined){
            camelCase=true;
        }
        var opts={};
        $.each(element.attributes,function(i,obj){
            var opt=obj.name;
            var val=obj.value;
            if(!testAttr(opt)){
                var patt=/data-/;
                if(patt.test(opt)){
                    opt=opt.replace('data-','');
                }
                if(camelCase && camelCase !=='false'){
                    (opt !=='template') ? opts[opt.toCamelCase()]= val.toCamelCase() : (opts[opt]=val);
                }else{
                    opts[opt.toCamelCase()]= val;
                }
            }
        });

        return opts;
    }

    /**
     *
     * @param attr {String}
     * @returns {boolean}
     */
    function testAttr(attr){
        var patt=/href|tcmuri|rowspan|colspan|class|nowrap|cellpadding|cellspacing/;
        return patt.test(attr);
    }


    /**
     * returns element 'name' attribute value
     * @param that {Object} this context of caller
     * @param name {String}
     * @returns {String}
     */
    function getName(that,name){
        var nodeName=that.nodeName.toLowerCase();
        if(nodeName ==='input' || nodeName==='select'){
            return name;
        }else{
            var name_=$(that).attr('name');
            return (typeof name_ !== 'undefined') ? name_ : name;
        }

    }

    /**
     * extends the object to pass to document.register for HTML element interfaces that inherit from HTMLElement
     * extended object={prototype:proto,extends:name}
     * ex: HTMLInputElement-->obj.extends='input'
     * @param name {String}
     * @param obj {Object}
     * @returns {Object}
     */
    function getExtendedObject(name,obj){
        var type=name.replace(/HTML/g,'').replace(/Element/g,'');
        type=type.toLowerCase();
        obj.extends=type;
        return obj;
    }

    /**
     *
     * @param element {Object}
     * @param camelCase {Boolean}
     * @returns {Object}
     */
    $.widget.getOpts=function(element,camelCase){
        return getOpts(element,camelCase);
    };

    /**
     * set up an observer to enable declarative element invocation
     */
    (function(){
        $.widget.observer = new MutationObserver($.widget.onMutation);
        $.widget.observer.observe($('body')[0], {childList: true,subtree:true});

        //polymer ready event
        document.addEventListener('WebComponentsReady', function() {
            var _custom= $.widget.customElementsObj();
            var Selector_=_custom.Selector;

            discoverUIElements(document,Selector_,_custom.customElements,true);
            discoverCustomDefinitionElements(document,true);
        });

    })();


    return $;

}));






/*
 * =============================================================
 * ellipsis.element  v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * ellipsis element: the ellipsis UI factory
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./widget'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./widget'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function ($) {

    /* customElements object */

    var customElements_=false;
    if($('html').hasClass('customelements')){
        customElements_=true;
    }

    /* define the base element  */
    $.widget('ellipsis.element',{

        /**
         * should never be overwritten, _initElement becomes the de facto dev hook
         * @private
         */
        _create:function(){
            /* init events array */
            this._data.events=[];
            $.extend(this.options, $.Widget.prototype.options);

            /* custom elements assignment */
            if(customElements_){
                this.options.$customElements=true;
                this._data.containerSelector=this._data.$containerSelector;
                this._data.overlayElement=this._data.$overlayElement;
                this._data.drawerElement=this._data.$drawerElement;
                this._data.listItem=this._data.$listItem;
                this._data.listItemElement=this._data.$listItemElement;
                this._data.menuElement=this._data.$menuElement;
                this._data.touchMenuElement=this._data.$touchMenuElement;
                this._data.searchRole=this._data.$searchRole;
                this._data.dropdownElement=this._data.$dropdownElement;
                this._data.toggleSelector=this._data.$toggleSelector;
                this._data.modalElement=this._data.$modalElement;
            }
            //this._onEventTrigger('loaded',{});
            this.__onCreate();
            this._onCreate();
            this._initElement();
            this.__onInit();
            var evt_=this.widgetName + '.loaded';
            $(window).trigger(evt_,{});
            if(customElements_){
                this.__componentCallbacks();
            }

        },

        /**
         * element hook for executing callstack of parent _initElement
         * @private
         */
        __onCreate: function(){
            /* we want "this" to be the widget instance */
            var widget=this;
            if(this.__initFunc && this.__initFunc.length){
                this.__initFunc.forEach(function(f){
                    f.call(widget);
                });
            }
        },


        _onCreate: $.noop,

        /**
         * init Element
         */
        _initElement: $.noop,

        /**
         * generally, should not overwrite this
         * @private
         */
        __onInit:function(){
            this._events();
            this._onInit();
        },

        /**
         * @private
         */
        _onInit: $.noop,


        /**
         * called by default by _onInit; event listener registrations should go here, although this is not a requirement
         */
        _events: $.noop,

        /**
         * event facade
         * register an event listener that is automatically disposed on _destroy()
         * if unbind=true, it is destroyed on any call to _unbindEvents() within the $.element lifecycle
         * NOTE: using the _event facade for event handling not a requirement, just a convenience. The convenience of this
         * facade pattern is not in writing event handlers per se, but in automating the cleanup
         *
         *
         * NOTE: the facade wrapper supports event delegation but does not automatically delegate
         * this._event(li,click,function(event){}) ---> no delegation, listener is attached to each li
         * this._event(ul,click,'li',function(event){}) -->delegation, listener is attached to ul, li clicks bubble up
         *
         * @param element {Object}
         * @param event {String}
         * @param selector {String}
         * @param unbind {Boolean}
         * @param callback {Function}
         * @private
         */
        _event: function (element, event, selector,unbind,callback) {
            var obj = {};
            obj.element = element;
            obj.event = event;

            //support 3-5 params
            var length=arguments.length;
            if(length===3){
                callback=(typeof selector==='function') ? selector : null;
                unbind=false;
                selector=null;
            }else if(length===4){
                callback=(typeof unbind==='function') ? unbind : null;
                if(typeof selector==='boolean'){
                    unbind=selector;
                    selector=null;
                }else{
                    unbind=false;
                }
            }
            obj.selector=selector;
            obj.unbind = unbind;
            obj.callback=callback;
            var arr = this._data.events;
            if ($.inArray(obj, arr) === -1) {
                this._data.events.push(obj);
            }
            if(selector){
                element.on(event,selector,function(){
                    var args = [].slice.call(arguments);
                    if(callback){
                        callback.apply(this,args);
                    }
                });
            }else{
                element.on(event,function(){
                    var args = [].slice.call(arguments);
                    if(callback){
                        callback.apply(this,args);
                    }
                });
            }

        },

        /**
         * unbinds registered event listeners. When called from _destroy(), all events are disposed, regardless.
         * If called during the $.element lifecycle, events are disposed if unbind flag was set at registration
         * @param destroy {Boolean}
         * @private
         */
        _unbindEvents: function (destroy) {
            if (typeof destroy === 'undefined') {
                destroy = false;
            }

            var events=this._data.events;
            $.each(events, function (index, obj) {
                if (!destroy) {
                    if (obj.unbind) {
                        (obj.selector) ? obj.element.off(obj.event,obj.selector,obj.callback) : obj.element.off(obj.event,obj.callback);
                        events.splice(index,1);
                    }
                } else {
                    (obj.selector) ? obj.element.off(obj.event,obj.selector,obj.callback) : obj.element.off(obj.event,obj.callback);
                }
            });

            if (destroy) {
                this._onUnbindEvents();
            }

        },

        /**
         * additional event cleanup, if needed, should be placed here. Invoked on _destroy()
         * @private
         */
        _onUnbindEvents: $.noop,

        /**
         *
         * @param opts {Object}
         * @private
         */
        _showLoader:function(opts){
            if(typeof opts==='undefined'){
                opts={};
            }
            var body=$('body');
            body.loading(opts);
        },

        /**
         *
         * @private
         */
        _hideLoader:function(){
            //this._data.loadingElement.loading('hide');
            var body=$('body');
            body.loading('hide');
        },

        /**
         * convenience wrapper for notification that uses $('body')
         * @param cssClass {String}
         * @param msg {String}
         * @param terminate {Boolean}
         * @param delay {Number}
         * @private
         */
        _notify:function(cssClass,msg,terminate,delay){
            var opts={};
            opts.cssClass=cssClass;
            opts.message=msg;
            opts.terminate=terminate;
            opts.terminateDelay=delay;
            this._notification($('body'),opts);
        },

        /**
         *
         * @param element {Object}
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _notification: function (element, opts, callback) {
            if(typeof opts==='function'){
                callback===opts;
                opts={};
            }else if(!opts){
                opts={};
            }

            opts.inline = opts.inline || false;
            opts.terminateTimeout=opts.terminateTimeout || 1000;
            opts.terminateDelay=opts.terminateDelay || 1000;
            opts.cssClass=opts.cssClass || 'info';
            opts.message=opts.message || 'processing...';
            opts.terminate=opts.terminate || false;


            element.notification(opts);
            element.notification('show');

            if (callback) {
                callback();
            }

        },

        _notificationLabel:function(opts,callback){
            if(this._data.notificationLabel){
                return;
            }
            opts=opts || {};
            opts.cssClass=opts.cssClass || 'info';
            opts.message=opts.message || 'message...';
            var label=$('<div class="ui-semantic-label ' + opts.cssClass + '">' + opts.message + '</div>');
            opts.inline=true;
            this._data.notificationLabel=label;
            this.element.append(label);
            this._notification(label,opts,callback);
        },

        _killNotificationLabel:function(){
            if(this._data.notificationLabel){
                this._data.notificationLabel.remove();
                this._data.notificationLabel=null;
            }
        },

        /**
         *
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _window: function (opts,callback) {
            opts.window=opts.window || {};
            opts.template=opts.template || 'ui-window';
            opts.window.modal = opts.window.modal || true;
            opts.window.animationIn=opts.window.animationIn || 'none';
            opts.context=opts.context || 'model';
            var container=$('<div data-window></div>');
            var body = $('body');
            body.append(container);
            var windowSelector=(this.options.$customElements) ? 'ui-window' : '.ui-window';
            this._render(container,opts,function(err,out){
                var window=container.find(windowSelector);
                window.window(opts.window);
                if(callback){
                    callback(null,window);
                }
                _onHide();

            });

            function _onHide(){
                $(window).on('window.hide',function(event,data){
                    try{
                        container[0].remove();
                    }catch(ex){
                        container.remove();
                    }

                    _off();
                });

            }
            function _off(){
                $(window).off('window.hide',function(event,data){
                    try{
                        container[0].remove();
                    }catch(ex){
                        container.remove();
                    }

                    _off();
                });
            }
        },

        /**
         * returns a window dimension based on passed height,width params and current viewport
         * @param maxWidth {Number}
         * @param maxHeight {Number}
         * @returns {Object}
         * @private
         */
        _getWindowDimensions:function(maxWidth,maxHeight){
            var win={
                height:maxHeight,
                width:maxWidth
            };

            var viewport=this._support.device.viewport;
            if(viewport.height < maxHeight){
                win.height=parseInt(.8*viewport.height);
            }
            if(viewport.width < maxWidth){
                win.width=parseInt(.7*viewport.width);
            }

            return win;

        },


        /**
         * destroy event
         * @private
         */
        _destroy: function () {

            this._unbindEvents(true);
            this.__onDispose();
            this._onDestroy();
            $.removeData(this.element[0],'custom-' + this.widgetName);

        },

        __onDispose:function(){
            var that=this;
            if(this.__disposeFunc && this.__disposeFunc.length){
                this.__disposeFunc.forEach(function(f){
                    f.call(that);
                });
            }
        },

        /* custom element callback events */

        __componentCallbacks:function(){
            var element=this.element[0];
            var self=this;
            element._attributeChangedCallback=function(name,oldValue,newValue){
                self._attributeChangedCallback(name,oldValue,newValue);
            };
            element._attachedCallback=function(){
                self._attachedCallback();
            };
            element._detachedCallback=function(){
                self._detachedCallback();
            };
        },

        _attachedCallback: $.noop,

        _detachedCallback: $.noop,

        _attributeChangedCallback: $.noop,



        /**
         * for cleanup
         * @private
         */
        _dispose: $.noop,


        /**
         * for cleanup
         * @private
         */
        _onDestroy: $.noop



    });


    /**
     * define the factory
     * @param ElementProto {Object} <optional>, only should be supplied if the element not derived from HTMLElement
     * @param name {String}
     * @param tagName {String} <optional>
     * @param base {Object} <optional>
     * @param prototype {Object}
     */
    $.element = function (ElementProto,name,tagName, base, prototype) {
        var baseObject;
        var tagName_=null;
        var ElementProto_=null;

        /* support 2-5 params */
        var length=arguments.length;
        if(length < 2){
            throw "Error: Element requires a minimum of two parameter types: string name and a singleton for the prototype"
        }else if(length===2){
            /*
                 $.element(ElementType,name) ---> $.element(name,prototype);
             */
            prototype = name;
            if(typeof ElementProto==='object'){
                throw "Error: Element requires a string name parameter";
            }
            if(typeof name!=='object'){
                throw "Error: Element requires a singleton for the prototype";
            }
            name=ElementProto;
            baseObject = $.ellipsis.element;
            base=null;
        }else if(length===3){
            /*
                $.element(ElementType,name,tagName) --->
                $.element(ElementType,name,prototype) or $.element(name,tagName,prototype) or $.element(name,base,prototype)
             */
            prototype=tagName;
            if(typeof ElementProto==='object'){
                if(typeof name!=='string'){
                    throw "Error: Element requires a string name parameter";
                }
                if(typeof tagName!=='object'){
                    throw "Error: Element requires a singleton for the prototype";
                }

                ElementProto_=ElementProto;
                baseObject = $.ellipsis.element;
                base=null;
            }else{
                if(typeof tagName==='object'){
                    if(typeof name==='string'){
                        tagName_=name;
                        baseObject = $.ellipsis.element;
                        base=null;
                    }else{
                        base=name;
                    }
                    name=ElementProto;
                }else{
                    throw "Error: Element requires a singleton for the prototype";
                }
            }


        }else if(length===4){
            /*
             $.element(ElementType,name,tagName,base) --->
             $.element(ElementType,name,tagName,prototype) or $.element(ElementType,name,base,prototype)
             or $.element(name,tagName,base,prototype)
             */
            prototype=base;
            if(typeof ElementProto==='object'){
                ElementProto_=ElementProto;
                if(typeof name!=='string'){
                    throw "Error: Element requires a string name parameter";
                }
                if(typeof tagName==='string'){
                    tagName_=tagName;
                    baseObject = $.ellipsis.element;
                    base=null;
                }else{
                    base=tagName;
                }
            }else{
                base=tagName;
                tagName_=name;
                name=ElementProto;
            }
        }else{
            /*
               $.element(ElementType,name,tagName,base,prototype)
             */
            ElementProto_=ElementProto;
            tagName_=tagName;

        }

        if(base){

            var initFunc=[];
            var disposeFunc=[];
            /* element inheritance creates a callstack for the parent elements' _initElement event,written to an array on the element prototype, so they get fired
               in sequence, avoiding being overwritten by the element's _initElement event
             */
            if($.utils.array.isArray(base)){ /* support passing in array of base elements, not just one */
                /* array */

                /* setup baseObject constructor */
                baseObject = function () {};
                baseObject._childConstructors = [];

                /* iterate and extend */
                base.forEach(function(obj){
                    /* obj.__initFunc array of _initElement gets concat'ed to the new stack */
                    if(obj.prototype.__initFunc && obj.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(obj.prototype.__initFunc);
                    }
                    if(obj.prototype.__disposeFunc && obj.prototype.__disposeFunc.length > 0){
                        disposeFunc=disposeFunc.concat(obj.prototype.__disposeFunc);
                    }
                    $.extend(baseObject.prototype, obj.prototype, $.ellipsis.element.prototype);

                    /* push obj._initElement onto initFunc stack */
                    initFunc.push(obj.prototype._initElement);
                    disposeFunc.push(obj.prototype._dispose);
                });

                /* attach the stack to the prototype */
                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
                if(disposeFunc.length > 0){
                    prototype.__disposeFunc=disposeFunc;
                }

            }else{
                /* object */
                if (base.prototype._initElement) {
                    baseObject = base;
                    if(baseObject.prototype.__initFunc && baseObject.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(baseObject.prototype.__initFunc);
                    }
                    if(baseObject.prototype.__disposeFunc && baseObject.prototype.__disposeFunc.length > 0){
                        disposeFunc=disposeFunc.concat(baseObject.prototype.__disposeFunc);
                    }
                    initFunc.push(baseObject.prototype._initElement);
                    disposeFunc.push(baseObject.prototype._dispose);
                } else {
                    /* base is not derived from element, so extend onto a baseObject constructor */
                    baseObject = function () {};
                    baseObject._childConstructors = [];
                    $.extend(baseObject.prototype, base.prototype, $.ellipsis.element.prototype);
                }

                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
                if(disposeFunc.length > 0){
                    prototype.__disposeFunc=disposeFunc;
                }
            }
        }

        /* implement using the extended jQuery UI factory */
        $.widget(name, baseObject, prototype);

        /* register the element as a custom element, if enabled */
        if(customElements_){
            if(!tagName_){
                tagName_=name.replace('.','-');
            }
            var name_= name.split( "." )[ 1 ];
            if(!ElementProto_){
                var __proto__=HTMLElement.prototype;
                __proto__._name='HTMLElement';
                __proto__._id=name_;
                __proto__._tag=tagName_;
                ElementProto_=__proto__;
            }else{
                ElementProto._id=name_;
                ElementProto._tag=tagName_;
            }
            $.widget.register(name_,tagName_,ElementProto_);


        }
    };

    //register framework css components as custom elements
    if(customElements_){
        $.element.custom=true;
        try{
            $.widget.registerFrameworkElements();
        }catch(ex){

        }
        $.widget.registerElement('ui-element');
    }

    //register template elements
    try{
        $.widget.registerTemplateElements();
    }catch(ex){

    }

    /* make public props/methods available on $.element */
    for(var key in $.widget){
        $.element[key]= $.widget[key];
    }




    return $;

}));
// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {
    if (typeof Object.observe !== 'function' ||
        typeof Array.observe !== 'function') {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    var arr = [];
    Object.observe(test, callback);
    Array.observe(arr, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 5)
      return false;

    if (records[0].type != 'add' ||
        records[1].type != 'update' ||
        records[2].type != 'delete' ||
        records[3].type != 'splice' ||
        records[4].type != 'splice') {
      return false;
    }

    Object.unobserve(test, callback);
    Array.unobserve(arr, callback);

    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0;
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  }

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  }

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    var path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, directObserver) {
      for (var i = 0; i < this.length; i++) {
        if (obj == null)
          return;
        obj = obj[this[i]];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[0]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n     ' + pathString + ' != null';
      }
      str += ')\n';

      var key = this[i];
      pathString += isIdent(key) ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return undefined;';
      return new Function('obj', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};

    for (var prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (var prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    var eomObj = { pingPong: true };
    var eomRunScheduled = false;

    Object.observe(eomObj, function() {
      runEOMTasks();
      eomRunScheduled = false;
    });

    return function(fn) {
      eomTasks.push(fn);
      if (!eomRunScheduled) {
        eomRunScheduled = true;
        eomObj.pingPong = !eomObj.pingPong;
      }
    };
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var observer;
      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      object: undefined,
      objects: objects,
      open: function(obs, object) {
        if (!rootObj) {
          rootObj = object;
          rootObjProps = {};
        }

        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
      }
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.object !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.object = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  }

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  var hasDebugForceFullDelivery = hasObserve && hasEval && (function() {
    try {
      eval('%RunMicrotasks()');
      return true;
    } catch (ex) {
      return false;
    }
  })();

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (hasDebugForceFullDelivery) {
      eval('%RunMicrotasks()');
      return;
    }

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        this.directObserver_ = getObservedObject(this, this.value_,
                                                 this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      };
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i]
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      var path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i]
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe)
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  }

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    for (var prop in added)
      added[prop] = object[prop];

    for (var prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (var prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      // "Addition" rows. Initialize null column.
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (var j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (var i = 1; i < rowCount; i++) {
        for (var j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return
      };

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  global.Observer = Observer;
  global.Observer.runEOM_ = runEOM;
  global.Observer.observerSentinel_ = observerSentinel; // for testing.
  global.Observer.hasObjectObserve = hasObserve;
  global.ArrayObserver = ArrayObserver;
  global.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  global.ArraySplice = ArraySplice;
  global.ObjectObserver = ObjectObserver;
  global.PathObserver = PathObserver;
  global.CompoundObserver = CompoundObserver;
  global.Path = Path;
  global.ObserverTransform = ObserverTransform;
})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root._utils=root._utils || {};
        root._utils.forEach=factory();
        root.returnExports = root._utils.forEach;
    }
}(this, function () {
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;

    return function forEach (obj, fn, ctx) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (l === +l) {
            for (var i = 0; i < l; i++) {
                fn.call(ctx, obj[i], i, obj);
            }
        } else {
            for (var k in obj) {
                if (hasOwn.call(obj, k)) {
                    fn.call(ctx, obj[k], k, obj);
                }
            }
        }
    };

}));









(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('foreach'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['foreach'], factory);
    } else {
        // Browser globals (root is window)
        root._utils.jsonPointer=factory(root._utils.forEach);
        root.returnExports = root._utils.jsonPointer;
    }
}(this, function (forEach) {

    /**
     * Convenience wrapper around the api.
     * Calls `.get` when called with an `object` and a `pointer`.
     * Calls `.set` when also called with `value`.
     * If only supplied `object`, returns a partially applied function, mapped to the object.
     *
     * @param obj
     * @param pointer
     * @param value
     * @returns {*}
     */
    var each=forEach;
    function api (obj, pointer, value) {
        // .set()
        if (arguments.length === 3) {
            return api.set(obj, pointer, value);
        }
        // .get()
        if (arguments.length === 2) {
            return api.get(obj, pointer);
        }
        // Return a partially applied function on `obj`.
        var wrapped = api.bind(api, obj);

        // Support for oo style
        for (var name in api) {
            if (api.hasOwnProperty(name)) {
                wrapped[name] = api[name].bind(wrapped, obj);
            }
        }
        return wrapped;
    }


    /**
     * Lookup a json pointer in an object
     *
     * @param obj
     * @param pointer
     * @returns {*}
     */
    api.get = function get (obj, pointer) {
        var tok,
            refTokens = api.parse(pointer);
        while (refTokens.length) {
            tok = refTokens.shift();
            if (!obj.hasOwnProperty(tok)) {
                throw new Error('Invalid reference token: ' + tok);
            }
            obj = obj[tok];
        }
        return obj;
    };

    /**
     * Sets a value on an object
     *
     * @param obj
     * @param pointer
     * @param value
     */
    api.set = function set (obj, pointer, value) {
        var refTokens = api.parse(pointer),
            tok,
            nextTok = refTokens[0];
        while (refTokens.length > 1) {
            tok = refTokens.shift();
            nextTok = refTokens[0];

            if (!obj.hasOwnProperty(tok)) {
                if (nextTok.match(/^\d+$/)) {
                    obj[tok] = [];
                } else {
                    obj[tok] = {};
                }
            }
            obj = obj[tok];
        }
        obj[nextTok] = value;
        return this;
    };

    /**
     * Removes an attribute
     *
     * @param obj
     * @param pointer
     */
    api.remove = function (obj, pointer) {
        var refTokens = api.parse(pointer);
        var finalToken = refTokens.pop();
        if (finalToken === undefined) {
            throw new Error('Invalid JSON pointer for remove: "' + pointer + '"');
        }
        delete api.get(obj, api.compile(refTokens))[finalToken];
    };

    /**
     * Returns a (pointer -> value) dictionary for an object
     *
     * @param obj
     * @param {function} descend
     * @returns {}
     */
    api.dict = function dict (obj, descend) {
        var results = {};
        api.walk(obj, function (value, pointer) {
            results[pointer] = value;
        }, descend);
        return results;
    };

    /**
     * Iterates over an object
     * Iterator: function (value, pointer) {}
     *
     * @param obj
     * @param {function} iterator
     * @param {function} descend
     */
    api.walk = function walk (obj, iterator, descend) {
        var refTokens = [];

        descend = descend || function (value) {
            var type = Object.prototype.toString.call(value);
            return type === '[object Object]' || type === '[object Array]';
        };

        (function next (cur) {
            each(cur, function (value, key) {
                refTokens.push(String(key));
                if (descend(value)) {
                    next(value);
                } else {
                    iterator(value, api.compile(refTokens));
                }
                refTokens.pop();
            });
        }(obj));
    };

    /**
     * Tests if an object has a value for a json pointer
     *
     * @param obj
     * @param pointer
     * @returns {boolean}
     */
    api.has = function has (obj, pointer) {
        try {
            api.get(obj, pointer);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Escapes a reference token
     *
     * @param str
     * @returns {string}
     */
    api.escape = function escape (str) {
        return str.toString().replace(/~/g, '~0').replace(/\//g, '~1');
    };

    /**
     * Unescapes a reference token
     *
     * @param str
     * @returns {string}
     */
    api.unescape = function unescape (str) {
        return str.replace(/~1/g, '/').replace(/~0/g, '~');
    };

    /**
     * Converts a json pointer into a array of reference tokens
     *
     * @param pointer
     * @returns {Array}
     */
    api.parse = function parse (pointer) {
        if (pointer === '') { return []; }
        if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
        return pointer.substring(1).split(/\//).map(api.unescape);
    };

    /**
     * Builds a json pointer from a array of reference tokens
     *
     * @param refTokens
     * @returns {string}
     */
    api.compile = function compile (refTokens) {
        if (refTokens.length === 0) { return ''; }
        return '/' + refTokens.map(api.escape).join('/');
    };

    return api;


}));










(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('json-pointer'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['json-pointer'], factory);
    } else {
        // Browser globals (root is window)
        root.Nested=factory(root._utils.jsonPointer);
        root.returnExports = root.Nested;
    }
}(this, function (jsonPointer) {

    var pointer = jsonPointer;
    var Nested=Object.create(null);
// This weak map is used for `.deliverChangeRecords(callback)` calls, where the
// provided callback has to mapped to its corresponding delegate.
    var delegates = new WeakMap; // <callback, delegate>

// When using `.observe(obj, callback)`, instead of forwarding the provided
// `callback` to `Object.observe(obj, callback)` directly, a delegate for the
// `callback` is created. This delegate transforms changes before forwarding
// them to the actual `callback`.
    var Delegate = function(callback) {
        this.callback  = callback;
        this.observers = new WeakMap;

        var self = this;
        this.handleChangeRecords = function(records) {
            try {
                var changes = records.map(self.transform, self);
                changes = Array.prototype.concat.apply([], changes); // flatten
                self.callback(changes)
            } catch (err) {
                if (Nested.debug) console.error(err.stack)
            }
        }
    };

// This method transforms the received change record with using the
// corresponding observer for the object that got changed.
    Delegate.prototype.transform = function(record) {
        var observers = this.observers.get(record.object);
        observers = observers.filter(function(value, index, self) {
            return self.indexOf(value) === index
        });
        return observers.map(function(observer) {
            return observer.transform(record)
        })
    };

// Each callback/object pair gets its own observer, which is used to track
// positions of nested objects and transforms change records accordingly.
    var Observer = function(root, delegate, accept) {
        this.root     = root;
        this.delegate = delegate;
        this.callback = delegate.handleChangeRecords;
        this.accept   = accept;
        this.paths    = new WeakMap
    }

// Recursively observe an object and its nested objects.
    Observer.prototype.observe = function(obj, path, visited) {
        if (!path)    path = '';
        if (!visited) visited = new WeakMap;

        if (visited.has(obj)) {
            return
        }

        visited.set(obj, true);

        // if the object is already observed, i.e., already somewhere else in the
        // nested structure -> do not observe it again
        if (!hasAt(this.delegate.observers, obj, this)) {
            if (Array.isArray(obj) && !this.accept) {
                Object.observe(obj, this.callback, ['add', 'update', 'delete', 'splice'])
            } else {
                Object.observe(obj, this.callback, this.accept)
            }
        }

        // track path and belonging
        addAt(this.paths, obj, path);
        addAt(this.delegate.observers, obj, this);

        // traverse the properties to find nested objects and observe them, too
        for (var key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !==null) {
                this.observe(obj[key], path + '/' + pointer.escape(key), visited)
            }
        }
    };

// Recursively unobserve an object and its nested objects.
    Observer.prototype.unobserve = function(obj, path) {
        console.log(path);
        if (!obj)  obj = this.root;
        if (!path) path = '';

        if (!hasAt(this.delegate.observers, obj, this)) {
            return
        }

        // clean up
        removeAt(this.paths, obj, path);
        removeAt(this.delegate.observers, obj, this);

        if (!this.paths.has(obj)) {
            Object.unobserve(obj, this.callback)
        }

        // traverse the properties to find nested objects and unobserve them, too
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                this.unobserve(obj[key], path + '/' + pointer.escape(key))
            }
        }
    };

// Transform a change record, ie., add the following properties:
// - **root** - the root of the nested structure
// - **path** - a [JSON Pointer](http://tools.ietf.org/html/rfc6901)
//              (absolute from the root) to the changed property
    Observer.prototype.transform = function(change) {
        var key = String(change.name || change.index);

        var path = this.paths.get(change.object)[0] + '/' + pointer.escape(key);
        var record = {
            root: this.root,
            path: path
        };

        // the original change record ist not extensible -> copy
        for (var prop in change) {
            record[prop] = change[prop]
        }

        // unobserve deleted/replaced objects
        var deleted = change.oldValue && [change.oldValue] || change.removed || [];
        deleted.forEach(function(oldValue) {
            if (!oldValue || typeof oldValue !== 'object') {
                return
            }

            var invalidPaths = this.paths.get(oldValue).filter(function(path) {
                return !pointer.has(this.root, path) || pointer.get(this.root, path) !== oldValue
            }, this);

            //this.unobserve(oldValue, invalidPaths[0])
        }, this);

        // observe added/updated objects
        var value = change.object[key];
        if (typeof value === 'object') {
            var desc = Object.getOwnPropertyDescriptor(change.object, key);
            if (desc.enumerable === true) {
                this.observe(value, path)
            } else {
                this.unobserve(value, path)
            }
        }

        Object.preventExtensions(record);

        return record
    };

// Corresponds to `Object.observe()` but for nested objects.

    Nested.observe = function(obj, callback, accept) {
        if(obj===undefined){return false;}
        var delegate;

        if (!delegates.has(callback)) {
            delegate = new Delegate(callback);
            delegates.set(callback, delegate)
        } else {
            delegate = delegates.get(callback)
        }

        var observers = delegate.observers;
        if (observers.has(obj)) {
            return
        }

        var observer = new Observer(obj, delegate, accept);
        observer.observe(obj)
    };

// Corresponds to `Object.unobserve()` but for nested objects.
    Nested.unobserve = function(obj, callback) {
        if (!delegates.has(callback)) return;
        var delegate = delegates.get(callback);

        if (!delegate.observers.has(obj)) {
            return
        }
        console.log('nested unobserve');
        var observers = delegate.observers.get(obj);
        observers.forEach(function(observer) {
            observer.unobserve()
        })
    };

// Corresponds to `Object.deliverChangeRecords()` but for nested objects.
    Nested.deliverChangeRecords = function(callback) {

        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function, given: ' + callback)
        }

        if (!delegates.has(callback)) return;

        var delegate = delegates.get(callback);
        Object.deliverChangeRecords(delegate.handleChangeRecords)
    };

// whether to log exceptions thrown during change record delivery
    Nested.debug = false;

// Helper function to check if a value exists in the array at the provided
// position in the provided WeakMap.
    function hasAt(map, key, value) {
        if (!map.has(key)) return false;
        return map.get(key).indexOf(value) !== -1
    }

// Helper function to add a value to an array at the provided position
// in the provided WeakMap.
    function addAt(map, key, value) {
        var set = (!map.has(key) && map.set(key, []), map.get(key));
        // if (set.indexOf(value) === -1)
        set.push(value)
    }

// Helper function to remove a value from the array at the provided position
// in the provided WeakMap.
    function removeAt(map, key, value) {
        // if (!map.has(key)) return
        var set = map.get(key);

        var index = set.indexOf(value);
        /*if (index > -1) */
        set.splice(index, 1);

        // if the set is empty, remove it from the WeakMap
        if (!set.length) map.delete(key)

    }

    return Nested;

}));



//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('observe-js'),require('elliptical-utils'),require('nested-observe'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['observe-js','elliptical-utils','nested-observe'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root,root.elliptical.utils,root.Nested);
    }
}(this, function (global,utils,Nested) {

    var _=utils._;

    /* necessary  private method/variable definitions copied over from observe-js ************************************************** */


    // Detect and do basic sanity checking on Object/Array.observe.
    function detectObjectObserve() {
        if (typeof Object.observe !== 'function' ||
            typeof Array.observe !== 'function') {
            return false;
        }

        //return false;

        var records = [];

        function callback(recs) {
            records = recs;
        }

        var test = {};
        var arr = [];
        Object.observe(test, callback);
        Array.observe(arr, callback);
        test.id = 1;
        test.id = 2;
        delete test.id;
        arr.push(1, 2);
        arr.length = 0;

        Object.deliverChangeRecords(callback);
        if (records.length !== 5)
            return false;

        if (records[0].type != 'add' ||
            records[1].type != 'update' ||
            records[2].type != 'delete' ||
            records[3].type != 'splice' ||
            records[4].type != 'splice') {
            return false;
        }

        Object.unobserve(test, callback);
        Array.unobserve(arr, callback);

        return true;
    }

    var hasObserve = detectObjectObserve();

    var OPENED = 1;

    function diffObjectFromOldObject(object, oldObject) {
        var added = {};
        var removed = {};
        var changed = {};

        for (var prop in oldObject) {
            var newValue = object[prop];

            if (newValue !== undefined && newValue === oldObject[prop])
                continue;

            if (!(prop in object)) {
                removed[prop] = undefined;
                continue;
            }

            if (newValue !== oldObject[prop])
                changed[prop] = newValue;
        }

        for (var prop in object) {
            if (prop in oldObject)
                continue;

            added[prop] = object[prop];
        }

        if (Array.isArray(object) && object.length !== oldObject.length)
            changed.length = object.length;

        return {
            added: added,
            removed: removed,
            changed: changed
        };
    }
    function getObservedObject(observer, object, arrayObserve) {
        var dir = observedObjectCache.pop() || newObservedObject();
        dir.open(observer);
        dir.observe(object, arrayObserve);
        return dir;
    }

    var observedObjectCache = [];

    function newObservedObject() {
        var observer;
        var object;
        var discardRecords = false;
        var first = true;

        function callback(records) {
            if (observer && observer.state_ === OPENED && !discardRecords)
                observer.check_(records);
        }
        return {
            open: function(obs) {
                if (observer)
                    throw Error('ObservedObject in use');

                if (!first)
                    Object.deliverChangeRecords(callback);

                observer = obs;
                first = false;
            },
            observe: function(obj, arrayObserve) {
                object = obj;
                if (arrayObserve)
                    Array.observe(object, callback);
                else
                    Object.observe(object, callback);
            },
            deliver: function(discard) {
                discardRecords = discard;
                Object.deliverChangeRecords(callback);
                discardRecords = false;
            },
            close: function() {
                observer = undefined;
                Object.unobserve(object, callback);
                observedObjectCache.push(this);
            }
        };
    }

    var expectedRecordTypes = {
        add: true,
        update: true,
        delete: true
    };


    function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
        var added = {};
        var removed = {};

        for (var i = 0; i < changeRecords.length; i++) {
            var record = changeRecords[i];
            if (!expectedRecordTypes[record.type]) {
                console.error('Unknown changeRecord type: ' + record.type);
                console.error(record);
                continue;
            }

            if (!(record.name in oldValues))
                oldValues[record.name] = record.oldValue;

            if (record.type == 'update')
                continue;

            if (record.type == 'add') {
                if (record.name in removed)
                    delete removed[record.name];
                else
                    added[record.name] = true;

                continue;
            }

            // type = 'delete'
            if (record.name in added) {
                delete added[record.name];
                delete oldValues[record.name];
            } else {
                removed[record.name] = true;
            }
        }

        for (var prop in added)
            added[prop] = object[prop];

        for (var prop in removed)
            removed[prop] = undefined;

        var changed = {};
        for (var prop in oldValues) {
            if (prop in added || prop in removed)
                continue;

            var newValue = object[prop];
            if (oldValues[prop] !== newValue)
                changed[prop] = newValue;
        }

        return {
            added: added,
            removed: removed,
            changed: changed
        };
    }
    /* end of private method/variable declarations ****************************************************************/

    /* elliptical observe only uses the Polymer ObjectObserver and PathObserver implementations. It also uses
     its own object change report implementation
     */

    /* overwrite the ObjectObserver Constructor
     *  Note: if no id prop is passed to the constructor, the entire implementation defaults to the standard polymer one, including
     *  the change reporting
     * */

    //first, save the prototype
    var ObjectObserver_prototype=ObjectObserver.prototype;

    //modify the constructor
    ObjectObserver= function(object,id){
        Observer.call(this);
        this.value_ = object;
        this.oldObject_ = undefined;
        /* modification */
        if(typeof id !=='undefined'){
            this.__id=id;
        }
    };
    //reassign the old prototype back to the modified constructor
    ObjectObserver.prototype=ObjectObserver_prototype;

    //modifications to prototype methods to allow reporting custom to elliptical
    ObjectObserver.prototype.connect_=function(){
        /* modification
         * if __id exists on the Observer prototype, we implement elliptical assignment
         * */
        if (hasObserve) {
            if(this.__id !=='undefined'){
                //elliptical assignment, use nested-observe for deliver changes, allowing for deep observe changes
                Nested.observe(this.value_,this.check_.bind(this));
            }else{
                //polymer assignment
                this.directObserver_ = getObservedObject(this, this.value_,this.arrayObserve);
            }

        } else {
            /* modification */
            if(this.__id !=='undefined'){
                //elliptical assignment
                this.oldObject_= _.cloneDeep(this.value_);
            }else{
                //polymer assignment
                this.oldObject_ = this.copyObject(this.value_);
            }

        }
    };
    ObjectObserver.prototype.check_=function(changeRecords, skipChanges) {
        /* modification
         * if __id exists on the Observer prototype, we implement elliptical deep change reporting
         * */

        if(this.__id !=='undefined'){
            var diff_;
            if(hasObserve){
                if (!changeRecords){
                    return false;
                }
                diff_=utils.nativeObjDiffReport(this.value_,changeRecords);
                this.callback_.call(this,diff_);
                return true;
            }else{
                //elliptical reporting, polyfill
                if(_.isEqual(this.value_,this.oldObject_)){
                    return false;
                }

                var oldCopy=this.oldObject_;
                this.oldObject_= _.cloneDeep(this.value_);
                diff_=utils.objDiffReport(this.value_,oldCopy,this.__id);
                this.callback_.call(this,diff_);

                return true;
            }

        }else{
            //polymer reporting
            var diff;
            var oldValues;
            if (hasObserve) {
                if (!changeRecords)
                    return false;

                oldValues = {};
                diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                    oldValues);
            } else {
                oldValues = this.oldObject_;
                diff = diffObjectFromOldObject(this.value_, this.oldObject_);
            }

            if (diffIsEmpty(diff))
                return false;

            if (!hasObserve)
                this.oldObject_ = this.copyObject(this.value_);

            this.report_([
                    diff.added || {},
                    diff.removed || {},
                    diff.changed || {},
                function(property) {
                    return oldValues[property];
                }
            ]);

            return true;
        }

    };

    ObjectObserver.prototype.disconnect_=function(){

        if (hasObserve) {
            if(this.__id !=='undefined'){
                Nested.unobserve(this.value_,function(){});
            }else{
                this.directObserver_.close();
                this.directObserver_ = undefined;
            }

        } else {
            this.oldObject_ = undefined;
        }
    };



    global.ObjectObserver=ObjectObserver;



    return global;

}));


// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

  function getTreeScope(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }

    return typeof node.getElementById === 'function' ? node : null;
  }

  Node.prototype.bind = function(name, observable) {
    console.error('Unhandled binding to Node: ', this, name, observable);
  };

  Node.prototype.bindFinished = function() {};

  function updateBindings(node, name, binding) {
    var bindings = node.bindings_;
    if (!bindings)
      bindings = node.bindings_ = {};
      /* modification from original repo */
      if (bindings[name]){
          if(binding[name]){
              binding[name].close();
          }else{
              bindings[name].close();
          }
      }


      return bindings[name] = binding;

  }

  function returnBinding(node, name, binding) {
    return binding;
  }

  function sanitizeValue(value) {
    return value == null ? '' : value;
  }

  function updateText(node, value) {
    node.data = sanitizeValue(value);
  }

  function textBinding(node) {
    return function(value) {
      return updateText(node, value);
    };
  }

  var maybeUpdateBindings = returnBinding;

  Object.defineProperty(Platform, 'enableBindingsReflection', {
    get: function() {
      return maybeUpdateBindings === updateBindings;
    },
    set: function(enable) {
      maybeUpdateBindings = enable ? updateBindings : returnBinding;
      return enable;
    },
    configurable: true
  });

  Text.prototype.bind = function(name, value, oneTime) {
    if (name !== 'textContent')
      return Node.prototype.bind.call(this, name, value, oneTime);

    if (oneTime)
      return updateText(this, value);

    var observable = value;
    updateText(this, observable.open(textBinding(this)));
    return maybeUpdateBindings(this, name, observable);
  }

  function updateAttribute(el, name, conditional, value) {
    if (conditional) {
      if (value)
        el.setAttribute(name, '');
      else
        el.removeAttribute(name);
      return;
    }

    el.setAttribute(name, sanitizeValue(value));
  }

  function attributeBinding(el, name, conditional) {
    return function(value) {
      updateAttribute(el, name, conditional, value);
    };
  }

  Element.prototype.bind = function(name, value, oneTime) {
    var conditional = name[name.length - 1] == '?';
    if (conditional) {
      this.removeAttribute(name);
      name = name.slice(0, -1);
    }

    if (oneTime)
      return updateAttribute(this, name, conditional, value);


    var observable = value;
    updateAttribute(this, name, conditional,
        observable.open(attributeBinding(this, name, conditional)));

    return maybeUpdateBindings(this, name, observable);
  };

  var checkboxEventType;
  (function() {
    // Attempt to feature-detect which event (change or click) is fired first
    // for checkboxes.
    var div = document.createElement('div');
    var checkbox = div.appendChild(document.createElement('input'));
    checkbox.setAttribute('type', 'checkbox');
    var first;
    var count = 0;
    checkbox.addEventListener('click', function(e) {
      count++;
      first = first || 'click';
    });
    checkbox.addEventListener('change', function() {
      count++;
      first = first || 'change';
    });

    var event = document.createEvent('MouseEvent');
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false,
        false, false, false, 0, null);
    checkbox.dispatchEvent(event);
    // WebKit/Blink don't fire the change event if the element is outside the
    // document, so assume 'change' for that case.
    checkboxEventType = count == 1 ? 'change' : first;
  })();

  function getEventForInputType(element) {
    switch (element.type) {
      case 'checkbox':
        return checkboxEventType;
      case 'radio':
      case 'select-multiple':
      case 'select-one':
        return 'change';
      case 'range':
        if (/Trident|MSIE/.test(navigator.userAgent))
          return 'change';
      default:
        return 'input';
    }
  }

  function updateInput(input, property, value, santizeFn) {
    input[property] = (santizeFn || sanitizeValue)(value);
  }

  function inputBinding(input, property, santizeFn) {
    return function(value) {
      return updateInput(input, property, value, santizeFn);
    }
  }

  function noop() {}

  function bindInputEvent(input, property, observable, postEventFn) {
    var eventType = getEventForInputType(input);

    function eventHandler() {
      observable.setValue(input[property]);
      observable.discardChanges();
      (postEventFn || noop)(input);
      Platform.performMicrotaskCheckpoint();
    }
    input.addEventListener(eventType, eventHandler);

    return {
      close: function() {
        input.removeEventListener(eventType, eventHandler);
        observable.close();
      },

      observable_: observable
    }
  }

  function booleanSanitize(value) {
    return Boolean(value);
  }

  // |element| is assumed to be an HTMLInputElement with |type| == 'radio'.
  // Returns an array containing all radio buttons other than |element| that
  // have the same |name|, either in the form that |element| belongs to or,
  // if no form, in the document tree to which |element| belongs.
  //
  // This implementation is based upon the HTML spec definition of a
  // "radio button group":
  //   http://www.whatwg.org/specs/web-apps/current-work/multipage/number-state.html#radio-button-group
  //
  function getAssociatedRadioButtons(element) {
    if (element.form) {
      return filter(element.form.elements, function(el) {
        return el != element &&
            el.tagName == 'INPUT' &&
            el.type == 'radio' &&
            el.name == element.name;
      });
    } else {
      var treeScope = getTreeScope(element);
      if (!treeScope)
        return [];
      var radios = treeScope.querySelectorAll(
          'input[type="radio"][name="' + element.name + '"]');
      return filter(radios, function(el) {
        return el != element && !el.form;
      });
    }
  }

  function checkedPostEvent(input) {
    // Only the radio button that is getting checked gets an event. We
    // therefore find all the associated radio buttons and update their
    // check binding manually.
    if (input.tagName === 'INPUT' &&
        input.type === 'radio') {
      getAssociatedRadioButtons(input).forEach(function(radio) {
        var checkedBinding = radio.bindings_.checked;
        if (checkedBinding) {
          // Set the value directly to avoid an infinite call stack.
          checkedBinding.observable_.setValue(false);
        }
      });
    }
  }

  HTMLInputElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value' && name !== 'checked')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);
    var sanitizeFn = name == 'checked' ? booleanSanitize : sanitizeValue;
    var postEventFn = name == 'checked' ? checkedPostEvent : noop;

    if (oneTime)
      return updateInput(this, name, value, sanitizeFn);


    var observable = value;
    var binding = bindInputEvent(this, name, observable, postEventFn);
    updateInput(this, name,
                observable.open(inputBinding(this, name, sanitizeFn)),
                sanitizeFn);

    // Checkboxes may need to update bindings of other checkboxes.
    return updateBindings(this, name, binding);
  }

  HTMLTextAreaElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateInput(this, 'value', value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateInput(this, 'value',
                observable.open(inputBinding(this, 'value', sanitizeValue)));
    return maybeUpdateBindings(this, name, binding);
  }

  function updateOption(option, value) {
    var parentNode = option.parentNode;;
    var select;
    var selectBinding;
    var oldValue;
    if (parentNode instanceof HTMLSelectElement &&
        parentNode.bindings_ &&
        parentNode.bindings_.value) {
      select = parentNode;
      selectBinding = select.bindings_.value;
      oldValue = select.value;
    }

    option.value = sanitizeValue(value);

    if (select && select.value != oldValue) {
      selectBinding.observable_.setValue(select.value);
      selectBinding.observable_.discardChanges();
      Platform.performMicrotaskCheckpoint();
    }
  }

  function optionBinding(option) {
    return function(value) {
      updateOption(option, value);
    }
  }

  HTMLOptionElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateOption(this, value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateOption(this, observable.open(optionBinding(this)));
    return maybeUpdateBindings(this, name, binding);
  }

  HTMLSelectElement.prototype.bind = function(name, value, oneTime) {
    if (name === 'selectedindex')
      name = 'selectedIndex';

    if (name !== 'selectedIndex' && name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);

    if (oneTime)
      return updateInput(this, name, value);

    var observable = value;
    var binding = bindInputEvent(this, name, observable);
    updateInput(this, name,
                observable.open(inputBinding(this, name)));

    // Option update events may need to access select bindings.
    return updateBindings(this, name, binding);
  }
})(this);

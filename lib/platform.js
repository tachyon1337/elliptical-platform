/*
 * =============================================================
 * elliptical.platform  v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * dependencies:
 * ellipsis-element
 * elliptical-observe
 * elliptical-nodebind
 * elliptical-utils
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('ellipse-utils'),require('ellipsis-touch'),require('ellipsis-animation'),
            require('ellipsis-element'),require('elliptical-observe'),require('elliptical-nodebind'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','ellipse-utils','ellipsis-touch','ellipsis-animation','ellipsis-element',
            'elliptical-observe','elliptical-nodebind'], factory);
    } else {
        // Browser globals (root is window)

        root.returnExports = factory(root.elliptical.utils);
    }
}(this, function (utils) {

    $.elliptical= $.elliptical || {};
    $.elliptical.hasObjectObserve=Observer.hasObjectObserve;
    $.elliptical.utils=utils;
    $.elliptical.startDirtyCheck=function(){
        var interval_=window.__dirtyCheckInterval || 500;
        console.log('dirty checking started...');
        var timeoutId=setInterval(function(){
            Platform.performMicrotaskCheckpoint();
        },interval_);
    };
    return $;


}));

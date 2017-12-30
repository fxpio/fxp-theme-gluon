/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global Headroom*/
/*global window*/

/**
 * @param {jQuery} $
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'headroom.js/dist/headroom.js'], factory);
    } else {
        // Browser globals
        factory(jQuery, Headroom);
    }
}(function ($, Headroom) {
    'use strict';

    // HEADROOM CLASS DEFINITION
    // =========================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this HeadroomPlugin
     */
    var HeadroomPlugin = function (element, options) {
        if (typeof options === 'object' && typeof options.scroller === 'string') {
            options.scroller = $(options.scroller);

            if (options.scroller.length > 0) {
                options.scroller = options.scroller.get(0);
            }
        }

        if (undefined !== options.scroller && $('html').hasClass('scroller-shrink')) {
            options.scroller = window;
        }

        this.$element = $(element);
        this.headroom = new Headroom(this.$element.get(0), options);
        this.headroom.init();
    },
        old;

    /**
     * Destroy instance.
     *
     * @this HeadroomPlugin
     */
    HeadroomPlugin.prototype.destroy = function () {
        this.headroom.destroy();
        this.$element.removeData('st.headroom');

        delete this.$element;
        delete this.headroom;
    };


    // HEADROOM PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.headroom'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new HeadroomPlugin(this, options);
                $this.data('st.headroom', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.headroom;

    $.fn.headroom             = Plugin;
    $.fn.headroom.Constructor = HeadroomPlugin;


    // HEADROOM NO CONFLICT
    // ====================

    $.fn.headroom.noConflict = function () {
        $.fn.headroom = old;

        return this;
    };


    // HEADROOM DATA-API
    // =================

    $(window).on('load', function () {
        $('[data-headroom]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

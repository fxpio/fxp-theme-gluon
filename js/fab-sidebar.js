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
/*global window*/

/**
 * @param {jQuery} $
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'fxp-jquery-sidebar'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Changes the css transform configuration on target element.
     *
     * @param {jQuery} $target   The element to edited
     * @param {string} transform The css transform configuration of target
     *
     * @private
     */
    function changeTransform($target, transform) {
        $target.css('-webkit-transform', transform);
        $target.css('transform', transform);
    }

    /**
     * Translate the jquery element with Translate 3D CSS.
     *
     * @param {jQuery } $target The jquery element
     * @param {Number}  delta   The delta of translate
     */
    function changeTranslate($target, delta) {
        var trans = delta + 'px, 0px, 0px';

        changeTransform($target, 'translate3d(' + trans + ')');
    }

    /**
     * Action on scoll of body is locked or unlocked.
     *
     * @param {jQuery.Event|Event} event The event
     *
     * @typedef {Number} jQuery.Event.eventData
     *
     * @private
     */
    function onLockBodyScroll (event) {
        var self = event.data;

        if (-1 !== $.inArray(event.type, ['sidebar:open', 'sidebar:force-open']) && !event.sidebar.isFullyOpened()) {
            changeTranslate(self.$element, calculatePosition(self.$element));
        } else {
            changeTransform(self.$element, '');
        }
    }

    function calculatePosition($fab) {
        var fabPosition = $fab.hasClass('btn-group-fab-top-right') || $fab.hasClass('btn-group-fab-bottom-right') ? 'right' : 'left',
            orientation = 'right' === fabPosition ? 1 : -1;

        return ($fab.outerWidth() + parseInt($fab.css(fabPosition), 10)) * orientation;
    }

    /**
     * Close the sidebar or reopen the locked sidebar on window resize event.
     *
     * @param {Event} event The event
     *
     * @typedef {Sidebar} Event.data The sidebar instance
     *
     * @private
     */
    function onResizeWindow(event) {
        var self = event.data;

        if (undefined === self.resizeDelay) {
            self.resizeDelay = window.setTimeout(function () {
                delete self.resizeDelay;

                if (self.$element.get(0).style.transform) {
                    changeTranslate(self.$element, calculatePosition(self.$element));
                }
            }, 350);
        }
    }

    // FAB SIDEBAR CLASS DEFINITION
    // ============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this FabSidebar
     */
    var FabSidebar = function (element, options) {
        var self       = this;

        this.guid      = $.guid;
        this.options   = $.extend(true, {}, FabSidebar.DEFAULTS, options);
        this.$element  = $(element);

        $(document).on('sidebar:force-open.fxp.sidebar.fxp.fab-sidebar sidebar:open.fxp.sidebar.fxp.fab-sidebar sidebar:close.fxp.sidebar.fxp.fab-sidebar', null, this, onLockBodyScroll);
        $(window).on('resize.fxp.fab-sidebar' + this.guid, null, this, onResizeWindow);
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    FabSidebar.DEFAULTS = {};

    /**
     * Destroy instance.
     *
     * @this FabSidebar
     */
    FabSidebar.prototype.destroy = function () {
        if (undefined !== this.resizeDelay) {
            window.clearTimeout(this.resizeDelay);
        }

        changeTransform(this.$element, '');
        $(document).off('sidebar:force-open.fxp.sidebar.fxp.fab-sidebar sidebar:open.fxp.sidebar.fxp.fab-sidebar sidebar:close.fxp.sidebar.fxp.fab-sidebar', null, onLockBodyScroll);
        $(window).off('resize.fxp.fab-sidebar' + this.guid, onResizeWindow);

        this.$element
            .removeData('st.fab-sidebar');

        delete this.$element;
        delete this.options;
        delete this.guid;
        delete this.resizeDelay;
    };


    // FAB SIDEBAR PLUGIN DEFINITION
    // =============================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.fab-sidebar'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new FabSidebar(this, options);
                $this.data('st.fab-sidebar', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.fabSidebar;

    $.fn.fabSidebar             = Plugin;
    $.fn.fabSidebar.Constructor = FabSidebar;


    // FAB SIDEBAR NO CONFLICT
    // =======================

    $.fn.fabSidebar.noConflict = function () {
        $.fn.fabSidebar = old;

        return this;
    };


    // FAB SIDEBAR DATA-API
    // ====================

    $(window).on('load', function () {
        $('[data-fab-sidebar="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

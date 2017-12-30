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
     * Refresh the top position of locked sidebar.
     *
     * @param {NavbarSidebar} self The navbar sidebar instance
     * @param {Number|String} top  The value of top position
     *
     * @private
     */
    function refreshPositionTop (self, top) {
        if (undefined === top || null === top || '' === top) {
            return;
        }

        top = 0 === top ? '' : top;

        self.$lockedSidebars.each(function (index, sidebar) {
            var $sidebar = $(sidebar),
                data = $sidebar.data('st.sidebar');

            if (data !== undefined) {
                data.$element.css('top', top);
                data.$swipe.css('top', top);

                if (undefined !== $sidebar.data('st.refresh-scroller-delay')) {
                    clearTimeout($sidebar.data('st.refresh-scroller-delay'));
                    $sidebar.removeData('st.refresh-scroller-delay');
                }

                $sidebar.data('st.refresh-scroller-delay', window.setTimeout(function () {
                    $sidebar.removeData('st.refresh-scroller-delay');
                    data.refresh();
                }, self.options.refreshDelay));
            }
        });
    }

    /**
     * Refresh the top position of locked sidebar.
     *
     * @param {NavbarSidebar} self The navbar sidebar instance
     *
     * @private
     */
    function refreshPosition (self) {
        var top = self.$element.offset().top + self.$element.outerHeight() - $(document).scrollTop();

        refreshPositionTop(self, undefined === top ? 0 : top);
    }

    /**
     * Refresh the top position of locked sidebar.
     *
     * @param {jQuery.Event|Event} event The event
     *
     * @private
     */
    function onAnimationEnd (event) {
        if (event.target == event.data.$element.get(0)) {
            refreshPosition(event.data);
        }
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
        var self = event.data,
            $body = $('body'),
            $navbar = self.$element,
            nativeScrollWidth = event.eventData,
            isLock = 'sidebar:lock-body-scroll' === event.type,
            margin = isLock ? nativeScrollWidth + 'px' : '',
            hasScrollbar = $body.get(0).scrollHeight > document.documentElement.clientHeight
                    && 'hidden' !== $body.css('overflow-y');

        if (nativeScrollWidth > 0 && (hasScrollbar || !isLock)) {
            $navbar.css('margin-right', margin);
        }
    }

    // NAVBAR SIDEBAR CLASS DEFINITION
    // ===============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this NavbarSidebar
     */
    var NavbarSidebar = function (element, options) {
        var self       = this;

        this.guid            = $.guid;
        this.options         = $.extend(true, {}, NavbarSidebar.DEFAULTS, options);
        this.$element        = $(element);
        this.$sidebars       = $(this.options.sidebarSelector);
        this.$lockedSidebars = $(this.options.sidebarSelector + '.sidebar-locked:not(.sidebar-full-locked)');

        if (0 === this.$sidebars.length) {
            return;
        }

        if (this.$element.hasClass('navbar-fixed-top')) {
            this.$element.on('webkitTransitionEnd.fxp.navbar-sidebar otransitionend.fxp.navbar-sidebar oTransitionEnd.fxp.navbar-sidebar msTransitionEnd.fxp.navbar-sidebar transitionend.fxp.navbar-sidebar', null, self, onAnimationEnd);
            refreshPosition(this);
        }

        this.$element
            .removeClass('navbar-sidebar-locked-left')
            .removeClass('navbar-sidebar-locked-right')
            .removeClass('navbar-sidebar-full-locked-left')
            .removeClass('navbar-sidebar-full-locked-right')
        ;

        if (this.$element.hasClass('navbar-fixed-top') || this.$element.hasClass('navbar-fixed-bottom')) {
            $(document).on('sidebar:lock-body-scroll.fxp.sidebar.fxp.navbar-sidebar sidebar:unlock-body-scroll.fxp.sidebar.fxp.navbar-sidebar', null, this, onLockBodyScroll);
        }

        this.$sidebars.each(function (index, sidebar) {
            var sidebarInstance = $(sidebar).data('st.sidebar'),
                $sidebar = sidebarInstance.$element;

            if ($sidebar.hasClass('sidebar-locked')) {
                self.$element.addClass('navbar-sidebar-locked-' + sidebarInstance.options.position);
            }

            if ($sidebar.hasClass('sidebar-full-locked')) {
                self.$element.addClass('navbar-sidebar-full-locked-' + sidebarInstance.options.position);
            }
        });
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    NavbarSidebar.DEFAULTS = {
        sidebarSelector: '[data-sidebar="true"]',
        refreshDelay: 350
    };

    /**
     * Refresh the top position of locked sidebar.
     *
     * @this NavbarSidebar
     */
    NavbarSidebar.prototype.refreshPosition = function () {
        refreshPosition(this);
    };

    /**
     * Destroy instance.
     *
     * @this NavbarSidebar
     */
    NavbarSidebar.prototype.destroy = function () {
        this.$lockedSidebars.each(function (index, sidebar) {
            var $sidebar = $(sidebar);

            if (undefined !== $sidebar.data('st.refresh-scroller-delay')) {
                clearTimeout($sidebar.data('st.refresh-scroller-delay'));
                $sidebar.removeData('st.refresh-scroller-delay');
            }
        });

        if (this.$element.hasClass('navbar-fixed-top') || this.$element.hasClass('navbar-fixed-bottom')) {
            $(document).off('sidebar:lock-body-scroll.fxp.sidebar.fxp.navbar-sidebar sidebar:unlock-body-scroll.fxp.sidebar.fxp.navbar-sidebar', null, onLockBodyScroll);
        }

        this.$element
            .off('webkitTransitionEnd.fxp.navbar-sidebar otransitionend.fxp.navbar-sidebar oTransitionEnd.fxp.navbar-sidebar msTransitionEnd.fxp.navbar-sidebar transitionend.fxp.navbar-sidebar', null, onAnimationEnd)
            .removeData('st.navbar-sidebar');

        delete this.$element;
    };


    // NAVBAR SIDEBAR PLUGIN DEFINITION
    // ================================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.navbar-sidebar'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new NavbarSidebar(this, options);
                $this.data('st.navbar-sidebar', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.navbarSidebar;

    $.fn.navbarSidebar             = Plugin;
    $.fn.navbarSidebar.Constructor = NavbarSidebar;


    // NAVBAR SIDEBAR NO CONFLICT
    // ==========================

    $.fn.navbarSidebar.noConflict = function () {
        $.fn.navbarSidebar = old;

        return this;
    };


    // NAVBAR SIDEBAR DATA-API
    // =======================

    $(window).on('load', function () {
        $('[data-navbar-sidebar="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

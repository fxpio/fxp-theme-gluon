/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
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
        define(['jquery', 'sonatra-jquery-sidebar'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

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

        this.guid      = $.guid;
        this.options   = $.extend(true, {}, NavbarSidebar.DEFAULTS, options);
        this.$element  = $(element);
        this.$sidebars = $(this.options.sidebarSelector);

        if (0 === this.$sidebars.length) {
            return;
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
        sidebarSelector: '[data-sidebar="true"]'
    };

    /**
     * Destroy instance.
     *
     * @this NavbarSidebar
     */
    NavbarSidebar.prototype.destroy = function () {
        this.$element
            .removeClass('navbar-sidebar-locked-left')
            .removeClass('navbar-sidebar-locked-right')
            .removeClass('navbar-sidebar-full-locked-left')
            .removeClass('navbar-sidebar-full-locked-right')
            .removeData('st.navbar-sidebar');

        delete this.$element;
    };


    // NAVBAR SIDEBAR PLUGIN DEFINITION
    // ================================

    function Plugin(option, value) {
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
                data[option](value);
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

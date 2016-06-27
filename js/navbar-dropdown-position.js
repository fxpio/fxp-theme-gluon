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
        define(['jquery', 'bootstrap/js/dropdown'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Get the width of native scrollbar.
     *
     * @returns {Number}
     */
    function getNativeScrollWidth() {
        var sbDiv = document.createElement("div"),
            size;
        sbDiv.style.width = '100px';
        sbDiv.style.height = '100px';
        sbDiv.style.overflow = 'scroll';
        sbDiv.style.position = 'absolute';
        sbDiv.style.top = '-9999px';
        document.body.appendChild(sbDiv);
        size = sbDiv.offsetWidth - sbDiv.clientWidth;
        document.body.removeChild(sbDiv);

        return size;
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
            $navbar = self.$element,
            margin = 'show' === event.type ? self.nativeScrollWidth + 'px' : '',
            hasScrollbar = self.$body.get(0).scrollHeight > document.documentElement.clientHeight
                    && 'hidden' !== self.$body.css('overflow-y');

        if (self.nativeScrollWidth > 0 && hasScrollbar) {
            $navbar.css('margin-right', margin);
        }
    }

    // NAVBAR DROPDOWN POSITION CLASS DEFINITION
    // =========================================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     *
     * @this NavbarDropdownPosition
     */
    var NavbarDropdownPosition = function (element) {
        this.guid              = $.guid;
        this.$element          = $(element);
        this.$body             = $('body');
        this.nativeScrollWidth = getNativeScrollWidth();

        $(document).on('show.bs.dropdown.st.navbar-dropdown-position-' + this.guid + ' hidden.bs.dropdown.st.navbar-dropdown-position-' + this.guid, null, this, onLockBodyScroll);
    },
        old;

    /**
     * Destroy instance.
     *
     * @this NavbarDropdownPosition
     */
    NavbarDropdownPosition.prototype.destroy = function () {
        $(document).off('show.bs.dropdown.st.navbar-dropdown-position-' + this.guid + ' hidden.bs.dropdown.st.navbar-dropdown-position-' + this.guid, null, onLockBodyScroll);
        this.$element.removeData('st.navbar-dropdown-position');

        delete this.$element;
    };


    // NAVBAR DROPDOWN POSITION PLUGIN DEFINITION
    // ==========================================

    function Plugin(option, value) {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('st.navbar-dropdown-position');

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new NavbarDropdownPosition(this);
                $this.data('st.navbar-dropdown-position', data);
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.navbarDropdownPosition;

    $.fn.navbarDropdownPosition             = Plugin;
    $.fn.navbarDropdownPosition.Constructor = NavbarDropdownPosition;


    // NAVBAR DROPDOWN POSITION NO CONFLICT
    // ====================================

    $.fn.navbarDropdownPosition.noConflict = function () {
        $.fn.navbarDropdownPosition = old;

        return this;
    };


    // NAVBAR DROPDOWN POSITION DATA-API
    // =================================

    $(window).on('load', function () {
        $('.navbar-fixed-top, .navbar-fixed-bottom').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

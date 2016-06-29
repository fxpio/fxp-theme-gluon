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
        define(['jquery', 'bootstrap/js/modal'], factory);
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
            margin = 'show' === event.type ? self.nativeScrollWidth + 'px' : '';

        if (self.nativeScrollWidth > 0) {
            $navbar.css('margin-right', margin);
        }
    }

    // NAVBAR MODAL CLASS DEFINITION
    // =============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     *
     * @this NavbarModal
     */
    var NavbarModal = function (element) {
        this.guid              = $.guid;
        this.$element          = $(element);
        this.$body             = $('body');
        this.nativeScrollWidth = getNativeScrollWidth();

        $(document).on('show.bs.modal.st.navbar-modal-' + this.guid + ' hidden.bs.modal.st.navbar-modal-' + this.guid, null, this, onLockBodyScroll);
    },
        old;

    /**
     * Destroy instance.
     *
     * @this NavbarModal
     */
    NavbarModal.prototype.destroy = function () {
        $(document).off('show.bs.modal.st.navbar-modal-' + this.guid + ' hidden.bs.modal.st.navbar-modal-' + this.guid, null, onLockBodyScroll);
        this.$element.removeData('st.navbar-modal');

        delete this.$element;
    };


    // NAVBAR MODAL PLUGIN DEFINITION
    // ==============================

    function Plugin(option, value) {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('st.navbar-modal');

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new NavbarModal(this);
                $this.data('st.navbar-modal', data);
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.navbarModal;

    $.fn.navbarModal             = Plugin;
    $.fn.navbarModal.Constructor = NavbarModal;


    // NAVBAR MODAL NO CONFLICT
    // ========================

    $.fn.navbarModal.noConflict = function () {
        $.fn.navbarModal = old;

        return this;
    };


    // NAVBAR MODAL DATA-API
    // =====================

    $(window).on('load', function () {
        $('.navbar-fixed-top, .navbar-fixed-bottom').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

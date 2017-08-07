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
            $fab = self.$element,
            isLock = 'show' === event.type,
            fabPosition = $fab.hasClass('btn-group-fab-bottom-right') ? 'right' : 'left',
            margin = isLock ? self.nativeScrollWidth + 'px' : '',
            hasScrollbar = self.$body.get(0).scrollHeight > document.documentElement.clientHeight
                    && 'hidden' !== self.$body.css('overflow-y');

        if (self.nativeScrollWidth > 0 && (hasScrollbar || !isLock)) {
            $fab.css('margin-' + fabPosition, margin);

            if (isLock) {
                $fab.css('transition', 'none');
            } else {
                window.setTimeout(function () {
                    $fab.css('transition', '');
                }, 0);
            }
        }
    }

    // FAB DROPDOWN POSITION CLASS DEFINITION
    // ======================================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     *
     * @this FabDropdownPosition
     */
    var FabDropdownPosition = function (element) {
        this.guid              = $.guid;
        this.$element          = $(element);
        this.$body             = $('body');
        this.nativeScrollWidth = getNativeScrollWidth();

        $(document).on('show.bs.dropdown.st.fab-dropdown-position-' + this.guid + ' hidden.bs.dropdown.st.fab-dropdown-position-' + this.guid, null, this, onLockBodyScroll);
    },
        old;

    /**
     * Destroy instance.
     *
     * @this FabDropdownPosition
     */
    FabDropdownPosition.prototype.destroy = function () {
        $(document).off('show.bs.dropdown.st.fab-dropdown-position-' + this.guid + ' hidden.bs.dropdown.st.fab-dropdown-position-' + this.guid, null, onLockBodyScroll);
        this.$element.removeData('st.fab-dropdown-position');

        delete this.$element;
    };


    // FAB DROPDOWN POSITION PLUGIN DEFINITION
    // =======================================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                data  = $this.data('st.fab-dropdown-position');

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new FabDropdownPosition(this);
                $this.data('st.fab-dropdown-position', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.fabDropdownPosition;

    $.fn.fabDropdownPosition             = Plugin;
    $.fn.fabDropdownPosition.Constructor = FabDropdownPosition;


    // FAB DROPDOWN POSITION NO CONFLICT
    // =================================

    $.fn.fabDropdownPosition.noConflict = function () {
        $.fn.fabDropdownPosition = old;

        return this;
    };


    // FAB DROPDOWN POSITION DATA-API
    // ==============================

    $(window).on('load', function () {
        $('.btn-group-fab-bottom-left, .btn-group-fab-bottom-right').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

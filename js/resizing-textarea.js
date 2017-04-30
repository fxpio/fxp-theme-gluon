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
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    // RESIZING TEXTAREA CLASS DEFINITION
    // ==================================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this ResizingTextarea
     */
    var ResizingTextarea = function (element, options) {
        this.guid     = $.guid;
        this.options  = $.extend(true, {}, ResizingTextarea.DEFAULTS, options);
        this.$element = $(element);

        if ('' === this.options.resizingTextareaSelector) {
            this.options.resizingTextareaSelector = null;
        }

        var $targets = null !== this.options.resizingTextareaSelector ? $(this.options.resizingTextareaSelector, this.$element)
            : this.$element;

        autosize($targets);
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    ResizingTextarea.DEFAULTS = {
        resizingTextareaSelector: null
    };

    /**
     * Destroy instance.
     *
     * @this ResizingTextarea
     */
    ResizingTextarea.prototype.destroy = function () {
        var $targets = null !== this.options.resizingTextareaSelector ? $(this.options.resizingTextareaSelector, this.$element)
            : this.$element;

        autosize.destroy($targets);

        this.$element.removeData('st.resizing-textarea');
    };


    // RESIZING TEXTAREA PLUGIN DEFINITION
    // ===================================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.resizing-textarea'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new ResizingTextarea(this, options);
                $this.data('st.resizing-textarea', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.resizingTextarea;

    $.fn.resizingTextarea             = Plugin;
    $.fn.resizingTextarea.Constructor = ResizingTextarea;


    // RESIZING TEXTAREA NO CONFLICT
    // =============================

    $.fn.resizingTextarea.noConflict = function () {
        $.fn.resizingTextarea = old;

        return this;
    };


    // RESIZING TEXTAREA DATA-API
    // ==========================

    $(window).on('load', function () {
        $('[data-resizing-textarea]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

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

    /**
     * Check the content size.
     *
     * @param {jQuery} $target The target
     */
    function checkContent($target) {
        if ('' === $target.val()) {
            $target.removeClass('has-floating-content');
        } else {
            $target.addClass('has-floating-content');
        }
    }

    /**
     * Display the floating label.
     *
     * @param {jQuery.Event|Event} event
     *
     * @private
     */
    function onFocusOut(event) {
        checkContent($(event.currentTarget));
    }

    // RIPPLE CLASS DEFINITION
    // =======================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this FloatingLabel
     */
    var FloatingLabel = function (element, options) {
        this.guid     = $.guid;
        this.options  = $.extend(true, {}, FloatingLabel.DEFAULTS, options);
        this.$element = $(element);

        if ('' === this.options.floatingLabelSelector) {
            this.options.floatingLabelSelector = null;
        }

        this.$element.on('focusout.st.floating-label change.st.floating-label' + this.guid, this.options.floatingLabelSelector, this, onFocusOut);

        var $targets = null !== this.options.floatingLabelSelector ? $(this.options.floatingLabelSelector, this.$element)
            : this.$element;

        $targets.each(function (index) {
            var $target = $targets.eq(index),
                $label = $('> label:not(.sr-only)', $target.parent()),
                placeholder = $target.attr('placeholder');

            checkContent($target);

            if ($('> .floating-bar', $target.parent()).length === 0) {
                $target.after('<span class="floating-bar"></span>');
            }

            if (0 === $label.length && placeholder) {
                $target.removeAttr('placeholder');
                $target.after('<label>' + placeholder + '</label>');
            } else if ($label.length > 0 && placeholder) {
                $target.addClass('fixed-floating-label');
            }

            window.setTimeout(function () {
                var $autoFills = $(':-webkit-autofill', $target.parent());

                if ($autoFills.length > 0) {
                    $target.addClass('has-floating-content');
                }
            }, 100);
        });
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    FloatingLabel.DEFAULTS = {
        floatingLabelSelector: null
    };

    /**
     * Destroy instance.
     *
     * @this FloatingLabel
     */
    FloatingLabel.prototype.destroy = function () {
        var $targets = null !== this.options.floatingLabelSelector ? $(this.options.floatingLabelSelector, this.$element)
                : this.$element;

        this.$element.off('focusout.st.floating-label change.st.floating-label' + this.guid, this.options.floatingLabelSelector, onFocusOut);

        $targets.each(function (index) {
            var $target = $targets.eq(index),
                $label = $('> label:not(.sr-only)', $target.parent());

            if ($label.length > 0) {
                $target.attr('placeholder', $label.text());
                $label.remove();
            }

            $('> .floating-bar', $target.parent()).remove();
            $target.removeClass('has-floating-content')
                .removeClass('fixed-floating-label');
        });

        this.$element.removeData('st.floating-label');
    };


    // RIPPLE PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.floating-label'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new FloatingLabel(this, options);
                $this.data('st.floating-label', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.floatingLabel;

    $.fn.floatingLabel             = Plugin;
    $.fn.floatingLabel.Constructor = FloatingLabel;


    // RIPPLE NO CONFLICT
    // ==================

    $.fn.floatingLabel.noConflict = function () {
        $.fn.floatingLabel = old;

        return this;
    };


    // RIPPLE DATA-API
    // ===============

    $(window).on('load', function () {
        $('[data-floating-label]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));

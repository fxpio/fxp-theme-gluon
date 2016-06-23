/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global navigator*/
/*global jQuery*/

/**
 * @param {jQuery} $
 *
 * @typedef {object} define.amd
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
     * Check if scroller shrink is required.
     *
     * @private
     */
    function requireShrink () {
        return $('html').attr('data-shrink') || /iPad|iPhone|iPod/.test(navigator.platform);
    }

    /**
     * Shrink the components.
     *
     * @param {jQuery|undefined} $container the container wrapper
     */
    window.scrollerShrinkComponents = function ($container) {
        if (!requireShrink()) {
            return;
        }

        $('[data-spy="affix"][data-target]', $container).each(function (index, element) {
            $(element).removeAttr('data-target');
        });
    };

    // SCROLLER SHRINK
    // ===============

    if (requireShrink()) {
        $('html').addClass('scroller-shrink');
    }

    window.scrollerShrinkComponents();
}));

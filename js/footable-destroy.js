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

/**
 * @param {jQuery} $
 *
 * @typedef {object} define.amd
 *
 * @author François Pluchino <francois.pluchino@sonatra.com>
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'footable'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    // DESTROY FOOTABLE DEFINITION
    // ===========================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     */
    function DestroyFootable(element) {
        var $ft = $(element);

        $(window).off('.footable');

        $('th, td', $ft)
            .removeClass('footable-visible footable-first-column footable-last-column')
            .css('display', '');

        $('tr', $ft).removeClass('footable-even footable-old footable-detail-show footable-disabled');

        $('tr.footable-row-detail', $ft).remove();
        $('span.footable-toggle', $ft).remove();

        $ft
            .removeClass('footable-loading footable-loaded footable phone tablet breakpoint')
            .removeData('breakpoint')
            .removeData('footable')
            .removeData('footable_info');
    }

    window.destroyFootable = DestroyFootable;
}));

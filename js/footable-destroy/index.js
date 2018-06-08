/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';
import 'footable/js/footable';

/**
 * @param {string|elements|object|jQuery} element
 */
window.destroyFootable = function (element) {
    let $ft = $(element);

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
};

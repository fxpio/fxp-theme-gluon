/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';

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

if (requireShrink()) {
    $('html').addClass('scroller-shrink');
}

window.scrollerShrinkComponents();

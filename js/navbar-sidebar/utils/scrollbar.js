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
 * Action on scoll of body is locked or unlocked.
 *
 * @param {jQuery.Event|Event} event The event
 *
 * @typedef {Number} jQuery.Event.eventData
 */
export function onLockBodyScroll (event) {
    let self = event.data,
        $body = $('body'),
        $navbar = self.$element,
        nativeScrollWidth = event.eventData,
        isLock = 'sidebar:lock-body-scroll' === event.type,
        margin = isLock ? nativeScrollWidth + 'px' : '',
        hasScrollbar = $body.get(0).scrollHeight > document.documentElement.clientHeight
            && 'hidden' !== $body.css('overflow-y');

    if (nativeScrollWidth > 0 && (hasScrollbar || !isLock)) {
        $navbar.css('margin-right', margin);
    }
}

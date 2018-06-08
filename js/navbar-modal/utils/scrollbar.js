/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Action on scoll of body is locked or unlocked.
 *
 * @param {jQuery.Event|Event} event The event
 *
 * @typedef {Number} jQuery.Event.eventData
 */
export function onLockBodyScroll (event) {
    let self = event.data,
        $navbar = self.$element,
        margin = 'show' === event.type ? self.nativeScrollWidth + 'px' : '';

    if (self.nativeScrollWidth > 0) {
        if ('' === margin && $navbar.attr('data-navbar-modal-skip')) {
            margin = self.nativeScrollWidth + 'px';
        }

        $navbar.css('margin-right', margin);
    }
}

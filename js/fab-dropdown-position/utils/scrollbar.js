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
        $fab = self.$element,
        isLock = 'show' === event.type,
        fabPosition = $fab.hasClass('btn-group-fab-top-right') || $fab.hasClass('btn-group-fab-bottom-right') ? 'right' : 'left',
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

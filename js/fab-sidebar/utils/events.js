/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {calculatePosition, changeTranslate} from './css';

/**
 * Close the sidebar or reopen the locked sidebar on window resize event.
 *
 * @param {Event} event The event
 *
 * @typedef {Sidebar} Event.data The sidebar instance
 */
export function onResizeWindow(event) {
    let self = event.data;

    if (undefined === self.resizeDelay) {
        self.resizeDelay = window.setTimeout(function () {
            delete self.resizeDelay;

            if (self.$element.get(0).style.transform) {
                changeTranslate(self.$element, calculatePosition(self.$element));
            }
        }, 350);
    }
}

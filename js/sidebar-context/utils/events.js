/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * On switch event.
 *
 * @param {jQuery.Event|Event} event
 */
export function onSwitch(event) {
    event.data.toggle();
}

/**
 * Close the sidebar context on window resize event.
 *
 * @param {Event} event The event
 *
 * @typedef {SidebarContext} Event.data The sidebar context instance
 */
export function onResizeWindow(event) {
    event.data.close();
}

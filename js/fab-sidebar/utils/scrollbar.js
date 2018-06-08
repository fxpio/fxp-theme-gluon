/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';
import {calculatePosition, changeTransform, changeTranslate} from './css';

/**
 * Action on scoll of body is locked or unlocked.
 *
 * @param {jQuery.Event|Event} event The event
 *
 * @typedef {Number} jQuery.Event.eventData
 */
export function onLockBodyScroll (event) {
    let self = event.data;

    if (-1 !== $.inArray(event.type, ['sidebar:open', 'sidebar:force-open']) && !event.sidebar.isFullyOpened()) {
        changeTranslate(self.$element, calculatePosition(self.$element));
    } else {
        changeTransform(self.$element, '');
    }
}

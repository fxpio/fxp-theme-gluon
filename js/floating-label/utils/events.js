/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';
import {checkContent} from './content';

/**
 * Display the floating label.
 *
 * @param {jQuery.Event|Event} event
 */
export function onFocusOut(event) {
    checkContent($(event.currentTarget));
}

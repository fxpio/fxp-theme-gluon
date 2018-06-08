/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BasePlugin from '@fxp/jquery-pluginify/js/plugin';
import $ from 'jquery';
import {onLockBodyScroll} from './utils/scrollbar';
import {getNativeScrollWidth} from '../utils/window';

/**
 * Fab Dropdown Position class.
 */
export default class FabDropdownPosition extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$body             = $('body');
        this.nativeScrollWidth = getNativeScrollWidth();

        $(document).on('show.bs.dropdown.fxp.fab-dropdown-position-' + this.guid + ' hidden.bs.dropdown.fxp.fab-dropdown-position-' + this.guid, null, this, onLockBodyScroll);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        $(document).off('show.bs.dropdown.fxp.fab-dropdown-position-' + this.guid + ' hidden.bs.dropdown.fxp.fab-dropdown-position-' + this.guid, null, onLockBodyScroll);

        super.destroy();
    }
}

pluginify('fabDropdownPosition', 'fxp.fab-dropdown-position', FabDropdownPosition, true, '.btn-group-fab-top-left, .btn-group-fab-top-right, .btn-group-fab-bottom-left, .btn-group-fab-bottom-right');

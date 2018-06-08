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
import {getNativeScrollWidth} from '../utils/window';
import 'bootstrap/js/dropdown';
import {onLockBodyScroll} from './utils/scrollbar';

/**
 * NavbarDropdownPosition class.
 */
export default class NavbarDropdownPosition extends BasePlugin
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

        $(document).on('show.bs.dropdown.fxp.navbar-dropdown-position-' + this.guid + ' hidden.bs.dropdown.fxp.navbar-dropdown-position-' + this.guid, null, this, onLockBodyScroll);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        $(document).off('show.bs.dropdown.fxp.navbar-dropdown-position-' + this.guid + ' hidden.bs.dropdown.fxp.navbar-dropdown-position-' + this.guid, null, onLockBodyScroll);

        super.destroy();
    }
}

pluginify('navbarDropdownPosition', 'fxp.navbar-dropdown-position', NavbarDropdownPosition, true, '.navbar-fixed-top, .navbar-fixed-bottom');

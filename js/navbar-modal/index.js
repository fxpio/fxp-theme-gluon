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
import {onLockBodyScroll} from './utils/scrollbar';

/**
 * Navbar Modal class.
 */
export default class NavbarModal extends BasePlugin
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

        $(document).on('show.bs.modal.fxp.navbar-modal-' + this.guid + ' hidden.bs.modal.fxp.navbar-modal-' + this.guid, null, this, onLockBodyScroll);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        $(document).off('show.bs.modal.fxp.navbar-modal-' + this.guid + ' hidden.bs.modal.fxp.navbar-modal-' + this.guid, null, onLockBodyScroll);

        super.destroy();
    }
}

pluginify('navbarModal', 'fxp.navbar-modal', NavbarModal, true, '.navbar-fixed-top, .navbar-fixed-bottom');

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
import {onResizeWindow} from './utils/events';
import {changeTransform} from './utils/css';
import {onLockBodyScroll} from './utils/scrollbar';

/**
 * FabSidebar class.
 */
export default class FabSidebar extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        $(document).on('sidebar:force-open.fxp.sidebar.fxp.fab-sidebar sidebar:open.fxp.sidebar.fxp.fab-sidebar sidebar:close.fxp.sidebar.fxp.fab-sidebar', null, this, onLockBodyScroll);
        $(window).on('resize.fxp.fab-sidebar' + this.guid, null, this, onResizeWindow);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        if (undefined !== this.resizeDelay) {
            window.clearTimeout(this.resizeDelay);
        }

        changeTransform(this.$element, '');
        $(document).off('sidebar:force-open.fxp.sidebar.fxp.fab-sidebar sidebar:open.fxp.sidebar.fxp.fab-sidebar sidebar:close.fxp.sidebar.fxp.fab-sidebar', null, onLockBodyScroll);
        $(window).off('resize.fxp.fab-sidebar' + this.guid, onResizeWindow);

        super.destroy();
    }
}

pluginify('fabSidebar', 'fxp.fab-sidebar', FabSidebar, true, '[data-fab-sidebar="true"]');

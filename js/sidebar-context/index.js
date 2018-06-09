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
import {onResizeWindow, onSwitch} from './utils/events';
import '@fxp/jquery-sidebar';

/**
 * Sidebar Context class.
 */
export default class SidebarContext extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$context = $(this.options.sidebarContextSelector, this.$element);

        this.$context.on('click.fxp.sidebar-context', null, this, onSwitch);

        if (this.options.sidebarContextCloseOnResize) {
            $(window).on('resize.fxp.sidebar-context' + this.guid, null, this, onResizeWindow);
        }
    }

    /**
     * Open the secondary menu.
     *
     * @this SidebarContext
     */
    open() {
        if (this.$element.hasClass('sidebar-menu-switched')) {
            return;
        }

        this.$element.addClass('sidebar-menu-switched');
        this.$element.sidebar('refresh');
    }

    /**
     * Close the secondary menu.
     */
    close() {
        if (!this.$element.hasClass('sidebar-menu-switched')) {
            return;
        }

        this.$element.removeClass('sidebar-menu-switched');
        this.$element.sidebar('refresh');
    }

    /**
     * Open or close the secondary menu.
     */
    toggle() {
        if (this.$element.hasClass('sidebar-menu-switched')) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        $(window).off('resize.fxp.sidebar-context' + this.guid, onResizeWindow);
        this.$context.off('click.fxp.sidebar-context', onSwitch);

        super.destroy();
    }
}

/**
 * Defaults options.
 */
SidebarContext.defaultOptions = {
    sidebarContextSelector:      '.sidebar-header .sidebar-menu-toggle',
    sidebarContextCloseOnResize: true
};

pluginify('sidebarContext', 'fxp.sidebar-context', SidebarContext, true, '[data-sidebar-context="true"]');

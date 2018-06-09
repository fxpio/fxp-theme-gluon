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
import {onAnimationEnd, refreshPosition} from "./utils/css";
import {onLockBodyScroll} from "./utils/scrollbar";
import '@fxp/jquery-sidebar';

/**
 * Navbar Sidebar class.
 */
export default class NavbarSidebar extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        let self = this;

        this.$sidebars       = $(this.options.sidebarSelector);
        this.$lockedSidebars = $(this.options.sidebarSelector + '.sidebar-locked:not(.sidebar-full-locked)');

        if (0 === this.$sidebars.length) {
            return;
        }

        if (this.$element.hasClass('navbar-fixed-top')) {
            this.$element.on('webkitTransitionEnd.fxp.navbar-sidebar otransitionend.fxp.navbar-sidebar oTransitionEnd.fxp.navbar-sidebar msTransitionEnd.fxp.navbar-sidebar transitionend.fxp.navbar-sidebar', null, self, onAnimationEnd);
            refreshPosition(this);
        }

        this.$element
            .removeClass('navbar-sidebar-locked-left')
            .removeClass('navbar-sidebar-locked-right')
            .removeClass('navbar-sidebar-full-locked-left')
            .removeClass('navbar-sidebar-full-locked-right')
        ;

        if (this.$element.hasClass('navbar-fixed-top') || this.$element.hasClass('navbar-fixed-bottom')) {
            $(document).on('sidebar:lock-body-scroll.fxp.sidebar.fxp.navbar-sidebar sidebar:unlock-body-scroll.fxp.sidebar.fxp.navbar-sidebar', null, this, onLockBodyScroll);
        }

        this.$sidebars.each(function (index, sidebar) {
            let sidebarInstance = $(sidebar).data('st.sidebar'),
                $sidebar = sidebarInstance.$element;

            if ($sidebar.hasClass('sidebar-locked')) {
                self.$element.addClass('navbar-sidebar-locked-' + sidebarInstance.options.position);
            }

            if ($sidebar.hasClass('sidebar-full-locked')) {
                self.$element.addClass('navbar-sidebar-full-locked-' + sidebarInstance.options.position);
            }
        });
    }

    /**
     * Refresh the top position of locked sidebar.
     */
    refreshPosition() {
        refreshPosition(this);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        this.$lockedSidebars.each(function (index, sidebar) {
            let $sidebar = $(sidebar);

            if (undefined !== $sidebar.data('st.refresh-scroller-delay')) {
                clearTimeout($sidebar.data('st.refresh-scroller-delay'));
                $sidebar.removeData('st.refresh-scroller-delay');
            }
        });

        if (this.$element.hasClass('navbar-fixed-top') || this.$element.hasClass('navbar-fixed-bottom')) {
            $(document).off('sidebar:lock-body-scroll.fxp.sidebar.fxp.navbar-sidebar sidebar:unlock-body-scroll.fxp.sidebar.fxp.navbar-sidebar', null, onLockBodyScroll);
        }

        this.$element
            .off('webkitTransitionEnd.fxp.navbar-sidebar otransitionend.fxp.navbar-sidebar oTransitionEnd.fxp.navbar-sidebar msTransitionEnd.fxp.navbar-sidebar transitionend.fxp.navbar-sidebar', null, onAnimationEnd);

        super.destroy();
    }
}

/**
 * Defaults options.
 */
NavbarSidebar.defaultOptions = {
    sidebarSelector: '[data-sidebar="true"]',
    refreshDelay: 350
};

pluginify('navbarSidebar', 'fxp.navbar-sidebar', NavbarSidebar, true, '[data-navbar-sidebar="true"]');

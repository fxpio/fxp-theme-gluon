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
import Headroom from 'headroom.js';

/**
 * Headroom class.
 */
export default class HeadroomPlugin extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        if (typeof options.scroller === 'string') {
            options.scroller = $(options.scroller);

            if (options.scroller.length > 0) {
                options.scroller = options.scroller.get(0);
            }
        }

        if (undefined !== options.scroller && $('html').hasClass('scroller-shrink')) {
            options.scroller = window;
        }

        this.headroom = new Headroom(this.$element.get(0), options);
        this.headroom.init();
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        this.headroom.destroy();

        super.destroy();
    }
}

pluginify('headroom', 'fxp.headroom', HeadroomPlugin, true, '[data-headroom]');

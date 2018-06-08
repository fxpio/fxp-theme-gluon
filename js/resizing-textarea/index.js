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
import autosize from 'autosize';

/**
 * ResizingTextarea class.
 */
export default class ResizingTextarea extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        if ('' === this.options.resizingTextareaSelector) {
            this.options.resizingTextareaSelector = null;
        }

        let $targets = null !== this.options.resizingTextareaSelector ? $(this.options.resizingTextareaSelector, this.$element)
            : this.$element;

        autosize($targets);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        let $targets = null !== this.options.resizingTextareaSelector ? $(this.options.resizingTextareaSelector, this.$element)
            : this.$element;

        autosize.destroy($targets);

        super.destroy();
    }
}

/**
 * Defaults options.
 */
ResizingTextarea.defaultOptions = {
    resizingTextareaSelector: null
};

pluginify('resizingTextarea', 'fxp.resizing-textarea', ResizingTextarea, true, '[data-resizing-textarea]');

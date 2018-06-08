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
import {onFocusOut} from './utils/events';
import {checkContent} from './utils/content';

/**
 * Floating Label class.
 */
export default class FloatingLabel extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        if ('' === this.options.floatingLabelSelector) {
            this.options.floatingLabelSelector = null;
        }

        this.$element.on('focusout.fxp.floating-label change.fxp.floating-label' + this.guid, this.options.floatingLabelSelector, this, onFocusOut);

        let $targets = null !== this.options.floatingLabelSelector ? $(this.options.floatingLabelSelector, this.$element)
            : this.$element;

        $targets.each(function (index) {
            let $target = $targets.eq(index),
                $label = $('> label:not(.sr-only)', $target.parent()),
                placeholder = $target.attr('placeholder');

            checkContent($target);

            if ($('> .floating-bar', $target.parent()).length === 0) {
                $target.after('<span class="floating-bar"></span>');
            }

            if (0 === $label.length && placeholder) {
                $target.removeAttr('placeholder');
                $target.after('<label>' + placeholder + '</label>');
            } else if ($label.length > 0 && placeholder) {
                $target.addClass('fixed-floating-label');
            }

            window.setTimeout(function () {
                let $autoFills = $(':-webkit-autofill', $target.parent());

                if ($autoFills.length > 0) {
                    $target.addClass('has-floating-content');
                }
            }, 100);
        });
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        let $targets = null !== this.options.floatingLabelSelector ? $(this.options.floatingLabelSelector, this.$element)
            : this.$element;

        this.$element.off('focusout.fxp.floating-label change.fxp.floating-label' + this.guid, this.options.floatingLabelSelector, onFocusOut);

        $targets.each(function (index) {
            let $target = $targets.eq(index),
                $label = $('> label:not(.sr-only)', $target.parent());

            if ($label.length > 0) {
                $target.attr('placeholder', $label.text());
                $label.remove();
            }

            $('> .floating-bar', $target.parent()).remove();
            $target.removeClass('has-floating-content')
                .removeClass('fixed-floating-label');
        });

        super.destroy();
    }
}

/**
 * Defaults options.
 */
FloatingLabel.defaultOptions = {
    floatingLabelSelector: null
};

pluginify('floatingLabel', 'fxp.floating-label', FloatingLabel, true, '[data-floating-label]');

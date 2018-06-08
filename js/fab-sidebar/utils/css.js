/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Changes the css transform configuration on target element.
 *
 * @param {jQuery} $target   The element to edited
 * @param {string} transform The css transform configuration of target
 */
export function changeTransform($target, transform) {
    $target.css('-webkit-transform', transform);
    $target.css('transform', transform);
}

/**
 * Translate the jquery element with Translate 3D CSS.
 *
 * @param {jQuery } $target The jquery element
 * @param {Number}  delta   The delta of translate
 */
export function changeTranslate($target, delta) {
    let trans = delta + 'px, 0px, 0px';

    changeTransform($target, 'translate3d(' + trans + ')');
}

export function calculatePosition($fab) {
    let fabPosition = $fab.hasClass('btn-group-fab-top-right') || $fab.hasClass('btn-group-fab-bottom-right') ? 'right' : 'left',
        orientation = 'right' === fabPosition ? 1 : -1;

    return ($fab.outerWidth() + parseInt($fab.css(fabPosition), 10)) * orientation;
}

/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check the content size.
 *
 * @param {jQuery} $target The target
 */
export function checkContent($target) {
    if ('' === $target.val()) {
        $target.removeClass('has-floating-content');
    } else {
        $target.addClass('has-floating-content');
    }
}

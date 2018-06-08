/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';

/**
 * Refresh the top position of locked sidebar.
 *
 * @param {jQuery.Event|Event} event The event
 */
export function onAnimationEnd (event) {
    if (event.target == event.data.$element.get(0)) {
        refreshPosition(event.data);
    }
}

/**
 * Refresh the top position of locked sidebar.
 *
 * @param {NavbarSidebar} self The navbar sidebar instance
 */
export function refreshPosition (self) {
    let top = self.$element.offset().top + self.$element.outerHeight() - $(document).scrollTop();

    refreshPositionTop(self, undefined === top ? 0 : top);
}

/**
 * Refresh the top position of locked sidebar.
 *
 * @param {NavbarSidebar} self The navbar sidebar instance
 * @param {Number|String} top  The value of top position
 *
 * @private
 */
function refreshPositionTop (self, top) {
    if (undefined === top || null === top || '' === top) {
        return;
    }

    top = 0 === top ? '' : top;

    self.$lockedSidebars.each(function (index, sidebar) {
        let $sidebar = $(sidebar),
            data = $sidebar.data('st.sidebar');

        if (data !== undefined) {
            data.$element.css('top', top);
            data.$swipe.css('top', top);

            if (undefined !== $sidebar.data('st.refresh-scroller-delay')) {
                clearTimeout($sidebar.data('st.refresh-scroller-delay'));
                $sidebar.removeData('st.refresh-scroller-delay');
            }

            $sidebar.data('st.refresh-scroller-delay', window.setTimeout(function () {
                $sidebar.removeData('st.refresh-scroller-delay');
                data.refresh();
            }, self.options.refreshDelay));
        }
    });
}

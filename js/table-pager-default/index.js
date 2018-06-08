/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TablePager from '@fxp/jquery-table-pager';
import $ from 'jquery';

TablePager.defaultOptions = {
    affixTarget:      $('html').hasClass('scroller-shrink') ? window : '.container-main',
    loadingTemplate: '<caption><div class="spinner-floating spinner-mini"><svg class="spinner spinner-accent"><circle class="spinner-path" cx="22" cy="22" r="20"></circle></svg></div></caption>'
};

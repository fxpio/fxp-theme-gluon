/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Generate the list.
 *
 * @param {Number} pn  The page number
 * @param {Number} ps  The page size
 * @param {Number} max The max size of the list
 *
 * @returns {Array}
 */
function getRows(pn, ps, max) {
    let rows = [],
        start = (pn - 1) * ps,
        end = 0 === ps ? max : Math.min(start + ps, max),
        i;

    for (i = start + 1; i <= end; i++) {
        rows.push({
            '_row_number': i,
            '_row_id': i,
            'id': i.toString(),
            'firstname': 'First name ' + i,
            'lastname': 'Last name ' + i,
            'username': 'Username ' + i,
            '_selectable': '<label><span class="form-control-md"><input type="checkbox" class="input-secondary"><span class="form-control-md-style"></span><span></span></span></span></label>'
        });
    }

    return rows;
}

/**
 * Webpack server.
 *
 * @param app
 */
module.exports = function (app) {
    let nunjucks = require('nunjucks'),
        expressNunjucks = require('express-nunjucks'),
        url = require('url'),
        fs = require('fs');

    app.set('views', __dirname);

    expressNunjucks(app, {
        watch: true,
        noCache: true,
        loader: nunjucks.FileSystemLoader,
        autoescape: true,
        filters: {
            is_fa_font: function (value) {
                return typeof value === 'string' && value.length > 3 && value.substr(0, 3) === 'fa ';
            }
        }
    });

    app.get('/ajax/table-example.json', function(req, res) {
        let max = 70,
            pn = 'pn' in req.query ? parseInt(req.query['pn']) : 1,
            ps = 'ps' in req.query ? parseInt(req.query['ps']) : 10,
            rows = getRows(pn, ps, max);

        res.json({
            size: max,
            pageNumber: pn,
            pageSize: ps,
            rows: rows,
            sortColumns: {}
        });
    });

    app.get('/:type/:name', function (req, res, next) {
        let page = url.parse(req.url).pathname;

        if (['components', 'style'].includes(req.params.type) && fs.existsSync(__dirname + page + '.html')) {
            res.render(page.replace(/^\/|\/$/g, ''), {app: {uri: page}});
            return;
        }

        next();
    });

    app.get('', function (req, res) {
        res.render('index');
    });
};

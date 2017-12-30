/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global require*/

function ajaxTable(url, req, res) {
    "use strict";

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
        var rows = [],
            start = (pn - 1) * ps,
            end = Math.min(start + ps, max),
            i;

        if (end === 0) {
            end = max;
        }

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

    var querystring = require('querystring'),
        params = querystring.parse(url.parse(req.url).query),
        max = 70,
        pn = params.hasOwnProperty('pn') ? parseInt(params.pn, 10) : 1,
        ps = params.hasOwnProperty('ps') ? parseInt(params.ps, 10) : 10,
        rows = getRows(pn, ps, max);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    res.write(JSON.stringify({
        size: max,
        pageNumber: pn,
        pageSize: ps,
        rows: rows,
        sortColumns: {}
    }));
    res.end();
}

function renderAsset(res, fs, mime, page, startPath, srcDirectory) {
    "use strict";

    var src,
        filestream;

    if (page.substr(0, startPath.length) === startPath) {
        src = __dirname + '/../' + srcDirectory + '/' + page.substr(startPath.length, page.length);

        fs.stat(src, function (err) {
            if (null !== err) {
                res.writeHead(404, {});
                res.write('<h1>404</h1><h2>File not found!</h2>');
                res.end();
            } else {
                res.setHeader('Content-type', mime.lookup(src));

                filestream = fs.createReadStream(src);
                filestream.pipe(res);
            }
        });

        return true;
    }

    return false;
}

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    nunjucks,
    src;

http.createServer(function (req, res) {
    'use strict';

    var page = url.parse(req.url).pathname,
        params = {app: {uri: page}},
        env;

    if (renderAsset(res, fs, mime, page, '/assets/', 'assets')) {
        return;
    }

    if (renderAsset(res, fs, mime, page, '/css/', 'css')) {
        return;
    }

    if (renderAsset(res, fs, mime, page, '/node_modules/', 'node_modules')) {
        return;
    }

    if (renderAsset(res, fs, mime, page, '/js/', 'js')) {
        return;
    }

    if (renderAsset(res, fs, mime, page, '/fonts/', 'fonts')) {
        return;
    }

    if (page.substr(0, 24) === '/ajax/table-example.json') {
        ajaxTable(url, req, res);
        return;
    }

    nunjucks = require('nunjucks');
    env = nunjucks.configure({ autoescape: true });

    env.addFilter('is_fa_font', function (value) {
        return typeof value === 'string' && value.length > 3 && value.substr(0, 3) === 'fa ';
    });

    if (page.substr(0, 12) === '/components/' || page.substr(0, 7) === '/style/') {
        src = __dirname + page;

        fs.stat(src, function (err) {
            if (null !== err) {
                res.writeHead(404, {});
                res.write('<h1>404</h1><h2>File not found!</h2>');
            } else {
                res.setHeader('Content-type', 'text/html');
                res.write(nunjucks.render(src, params));
            }

            res.end();
        });

        return;
    }

    if (page === '/' || page === 'index.html') {
        res.setHeader('Content-type', 'text/html');
        res.write(nunjucks.render('examples/index.html', params));
        res.end();
        return;
    }

    res.write('<h1>404</h1><h2>File not found!</h2>');
    res.end();
}).listen(9000);

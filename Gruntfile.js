/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global module*/
/*global require*/
/*global grunt*/
/*global setTimeout*/

module.exports = function (grunt) {
    'use strict';

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: '**/*.js',
                options: {
                    livereload: true
                }
            },
            less: {
                files: '**/*.less',
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        less: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    "css/font-awesome.css": "node_modules/font-awesome/less/font-awesome.less",
                    "css/bootstrap.css": "less/bootstrap/bootstrap.less",
                    "css/bootstrap-theme.css": "less/bootstrap-theme/bootstrap-theme.less",
                    "css/footable.css": "less/footable/footable.less",
                    "css/footable-striped.css": "less/footable-striped/footable-striped.less",
                    "css/select2-bootstrap-theme.css": "less/select2-bootstrap-theme/select2-bootstrap-theme.less",
                    "css/fxp-bootstrap-panel-collapse.css": "less/bootstrap-panel-collapse/bootstrap-panel-collapse.less",
                    "css/fxp-bootstrap-dropdown-position.css": "less/bootstrap-dropdown-position/bootstrap-dropdown-position.less",
                    "css/fxp-bootstrap-nav-scroll.css": "less/bootstrap-nav-scroll/bootstrap-nav-scroll.less",
                    "css/fxp-jquery-datetime-picker.css": "less/jquery-datetime-picker/jquery-datetime-picker.less",
                    "css/fxp-jquery-scroller.css": "less/jquery-scroller/jquery-scroller.less",
                    "css/fxp-jquery-sidebar.css": "less/jquery-sidebar/jquery-sidebar.less",
                    "css/fxp-select2-responsive.css": "less/select2-responsive/select2-responsive.less",
                    "css/fxp-jquery-table-select.css": "less/jquery-table-select/jquery-table-select.less",
                    "css/fxp-jquery-table-pager.css": "less/jquery-table-pager/jquery-table-pager.less",
                    "css/fxp-jquery-table-sort.css": "less/jquery-table-pager/jquery-table-sort.less",
                    "css/fxp-jquery-ripple.css": "less/jquery-ripple/jquery-ripple.less",
                    "css/gluon.css": "less/gluon/gluon.less"
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/bootstrap/fonts/*', 'node_modules/font-awesome/fonts/*'],
                        dest: 'fonts/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'examples/index.js',
                options: {
                    callback: function (nodemon) {
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function () {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('serve', function () {
        grunt.task.run([
            'copy',
            'less',
            'concurrent'
        ]);
    });

    grunt.registerTask('default', [
        'serve'
    ]);
};

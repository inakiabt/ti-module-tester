'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var moduleDir = grunt.option('module-dir') || '..',
        json = grunt.file.readJSON(moduleDir + '/package.json'),
        appName = json.name + '-tests',
        workspaceDir = 'tmp',
        projectDir = workspaceDir + '/' + appName,
        projectAppifiedDir = projectDir + '/appify',
        moduleType = json.titaniumManifest && json.titaniumManifest.type ? json.titaniumManifest.type : 'commonjs',
        successString = '[object YyTidynamicfontModule] loaded';

    grunt.initConfig({
        pkg: json,
        moduleType: moduleType,

        titanium: {
            create: {
                options: {
                    command: 'create',
                    id: 'grunttitanium.' + appName.replace(/-|_/g, ''),
                    name: appName,
                    projectDir: projectDir,
                    workspaceDir: workspaceDir
                }
            },
            build: {
                options: {
                    command: 'build',
                    platform: 'ios',
                    projectDir: projectAppifiedDir,
                    success: successString
                }
            },
            clean: {
                options: {
                    command: 'clean',
                    projectDir: projectAppifiedDir
                }
            }
        },
        copy: {
            'native-module-built': {
                expand: true,
                cwd: moduleDir + '/iphone',
                src: './*.zip',
                dest: './dist'
            },
            specs: {
                expand: true,
                cwd: moduleDir + '/spec',
                src: './**',
                dest: projectAppifiedDir + '/spec'
            },
            'jasmin-expect': {
                expand: true,
                cwd: path.dirname(require.resolve('jasmine-expect')),
                src: './**',
                dest: projectAppifiedDir + '/Resources/jasmine-expect'
            }
        },
        mkdir: {
            appify: {
                options: {
                    create: [projectAppifiedDir]
                }
            }
        },
        unzip: {
            module: {
                src: 'dist/<%= pkg.name %>-<%= moduleType %>-<%= pkg.version %>.zip',
                dest: projectAppifiedDir
            }
        },
        tishadow: {
            test: {
                command: 'spec',
                options: {
                    projectDir: projectAppifiedDir
                }
            },
            appify: {
                command: 'appify',
                options: {
                    projectDir: projectDir,
                    dest: 'appify'
                }
            },
            clear: {
                command: 'clear',
                options: {
                    projectDir: projectAppifiedDir
                }
            }
        },
        run: {
            'build-native-module': {
                options: {
                    cwd: moduleDir + '/iphone'
                },
                type: 'shell',
                cmd: './build.py'
            }
        },
        titaniumifier: {
            build: {
                files: {
                    'dist': [moduleDir]
                },
                options: {
                    bundle: true,
                    module: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-titanium');
    grunt.loadNpmTasks('grunt-tishadow');
    grunt.loadNpmTasks('grunt-titaniumifier');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-run');

    var buildTaskName = moduleType === 'iphone' ? 'native:build' : 'titaniumifier:build';

    grunt.registerTask('tiapp:addmodule', function() {
        var tiapp = require('tiapp.xml').load(projectAppifiedDir + '/tiapp.xml');

        tiapp.setModule(json.name, json.version);
        tiapp.write();
        grunt.log.ok('Module "' + json.name + '" version ' + json.version + ' added');
    });

    grunt.registerTask('native:build', [
        'run:build-native-module',
        'copy:native-module-built'
    ]);

    grunt.registerTask('test', [
        'copy:specs',
        'tishadow:test'
    ]);

    grunt.registerTask('test:clear', [
        'tishadow:clear'
    ]);

    grunt.registerTask('appify', [
        'mkdir:appify',
        'tishadow:appify',
        'unzip:module',
        'copy:jasmin-expect',
        'tiapp:addmodule'
    ]);

    grunt.registerTask('app:setup', [
        'titanium:create',
        buildTaskName,
        'appify'
    ]);

    grunt.registerTask('app:build', [
        'titanium:build'
    ]);

    grunt.registerTask('clear', [
        'test:clear',
        'titanium:clean'
    ]);

    grunt.registerTask('module:build', [
        buildTaskName,
        'unzip:module',
        'tiapp:addmodule'
    ]);

    grunt.registerTask('module:setup', [
        'module:build',
        'appify',
        'app:build'
    ]);

    grunt.registerTask('default', ['app:setup', 'app:build', 'test']);

};

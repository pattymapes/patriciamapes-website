/*
 * assemble-examples <https://github.com/assemble/assemble-examples>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */


module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    assemble: {
      options: {
        flatten: true,
        plugins:['grunt-assemble-permalinks'],
        partials: ['templates/includes/*.hbs'],
        layoutdir: 'templates/layouts',
        layout: 'default.hbs',
        permalinks:{
          structure:':basename/index.html'
        }
      },
      site: {
        files: { 'dest/': ['templates/*.hbs'] }
      }
    },
    connect: {
      server: {
        options: {
          base: './dest',
          port: 3000,
          livereload: true,
          open: true
        }
      }
    },
    //config for the watch command
    watch:{
      pages:{
        files:['templates/*','content/*'],
        tasks:['assemble'],
        options:{
          spawn:true,
          livereload:true
        }
      }
    }
  });

  // Load the Assemble plugin.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default task to run with the `grunt` command.
  grunt.registerTask('default', ['assemble','connect','watch']);
};

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
        plugins: ['grunt-assemble-permalinks'],
        partials: ['templates/includes/*.hbs'],
        layoutdir: 'templates/layouts',
        layout: 'default.hbs',
        permalinks: {
          structure: ':basename/index.html'
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
    clean: ['dest/*'],
    //config for the watch command
    watch: {
      pages: {
        files: ['templates/*', 'content/*'],
        tasks: ['assemble'],
        options: {
          spawn: true,
          livereload: true
        }
      }
    },

    //deployment setup

    aws: grunt.file.readJSON('deploy-keys.json'), // Load deploy variables
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        region: '<%= aws.AWSRegion %>',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      production: {
        options: {
          bucket: '<%= aws.bucket %>',
        },
        files: [
          { expand: true, cwd: 'dest/', src: ['**'], dest: '/' }
        ]
      },
    },

    cloudfront_invalidate: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        distributionId: '<%= aws.AWSCloudfrontId %>',
        path: '/*'
      }
    },



  });

  // Load the Assemble plugin.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-cloudfront-invalidate');

  // The default task to run with the `grunt` command.
  grunt.registerTask('default', ['clean', 'assemble', 'connect', 'watch']);

  grunt.registerTask('deploy', ['clean', 'assemble', 'aws_s3', 'cloudfront_invalidate']);
};

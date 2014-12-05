/**
 * 
 * Run 'grunt' to generate JS and CSS in folder 'dist' and site in folder '_site'
 * *
 * Run 'grunt watch' to automatically regenerate '_site' when you change files in 'src' or in 'website'
 * 
 */

module.exports = function(grunt) {

  'use strict';

  var jekyllConfig = "isLocal : false \r\n"+
"permalink: /:title/ \r\n"+
"exclude: ['.json', '.rvmrc', '.rbenv-version', 'README.md', 'Rakefile', 'changelog.md', 'compiler.jar', 'private', 'photoswipe.sublime-project', 'photoswipe.sublime-workspace', '.htaccess'] \r\n"+
"auto: true \r\n"+
"pswpversion: <%= pkg.version %> \r\n"+

"markdown: redcarpet \r\n"+
"kramdown: \r\n"+
"  input: GFM \r\n";
  
  var awsDefaults = {};
  if( grunt.file.exists('./aws-keys.json') ) {
    awsDefaults = grunt.file.readJSON('./aws-keys.json')
  }



  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('photoswipe.json'),

    banner: '/*! PhotoSwipe - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */\n',

    defaultUIBanner:  '/*! PhotoSwipe Default UI - <%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */\n',

    // Task configuration.
    clean: {
      files: ['dist']
    },
    
    sass: {                            
      dist: {                      
        files: {      
          'dist/photoswipe.css': 'src/css/main.scss',
          'dist/default-skin/default-skin.css': 'src/css/default-skin/default-skin.scss'
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    pswpbuild: {
      all: {
        src: [
          'framework-bridge',

          'core',
          'down-move-up-handlers',
          // 'ie-low',
          'items-controller',
          'tap',
          'desktop-zoom',
          'history',

          

         /* 'inline',
          'ajax',
          'image',
          'zoom',
          'iframe',
          'gallery',
          'retina',
          'fastclick' */
        ],
        basePath: 'src/js/',
        dest: 'dist/photoswipe.js',
        uidest: 'dist/photoswipe-ui-default.js',
        banner: '<%= banner %>',
        defaultUIBanner: '<%= defaultUIBanner %>'
      }
    },
    jekyll: {
      dev: {
        src: 'website',
        dest: '_site',
        url: 'local',
        raw: jekyllConfig + "url: local"
      },
      production: {
        src: 'website',
        dest: '_production',
        url: 'production',
        raw: jekyllConfig + "url: production"
      }
    },

    copy: {
      dev: {
        files: [
          {src: ['src/css/default-skin/default-skin.svg'], dest: 'dist/default-skin/default-skin.svg'},
          {src: ['src/css/default-skin/default-skin.png'], dest: 'dist/default-skin/default-skin.png'},
          {src: ['src/css/default-skin/preloader.gif'], dest: 'dist/default-skin/preloader.gif'},
          {src: ['dist/**'], dest: '_site/'}
        ]
      },
      main: {
        files: [
          {src: ['dist/**'], dest: 'website/'}
        ]
      },

    },

    uglify: {
      my_target: {
        files: {
          'dist/photoswipe.min.js': ['dist/photoswipe.js'],
          'dist/photoswipe-ui-default.min.js': ['dist/photoswipe-ui-default.js']
        },
        preserveComments: 'some'
      },
      options: {
        preserveComments: 'some'
      }
    },

    watch: { // for development run 'grunt watch'
      jekyll: {
        files: ['website/**'],
        tasks: ['jekyll:dev', 'copy:dev']
      },
      files: ['src/**'],
      tasks: [ 'sass', 'pswpbuild', 'copy:dev', 'uglify']
    },



    cssmin: {
      compress: {
        files: {
          "website/site-assets/all.min.css": ["website/site-assets/site.css", "website/dist/photoswipe.css"]
        }
      }
    },

    //,
    // aws: grunt.file.readJSON('aws-keys.json'), // Read the file
    
    aws_s3: {
      options: {
        accessKeyId: awsDefaults ? awsDefaults.AWSAccessKeyId : '', // Use the variables
        secretAccessKey: awsDefaults ? awsDefaults.AWSSecretKey : '', // You can also use env variables
        region: 'eu-west-1',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      main: {
        options: {
          bucket: 'photoswipe',//,
          params: {
            //ContentEncoding: 'gzip' // applies to all the files!
          }
          // mime: {
          //   'dist/assets/production/LICENCE': 'text/plain'
          // }
        },
        files: [

          { expand: true, cwd: 'dist/', src: ['**'], dest: 'pswp/dist/', params: {CacheControl: 'max-age=86400'} }


        ]
      }
    }


  });


  // grunt pswpbuild --pswp-exclude=ajax,image
  grunt.task.registerMultiTask('pswpbuild', 'Makes PhotoSwipe core JS file.', function() {

    var files = this.data.src,
        includes = grunt.option('pswp-exclude'),
        basePath = this.data.basePath,
        newContents = this.data.banner;// + ";(function(w) {\n\t\"use strict\";\n";


    newContents += "(function (root, factory) { \n"+
      "\tif (typeof define === 'function' && define.amd) {\n" +
        "\t\tdefine(factory);\n" +
      "\t} else if (typeof exports === 'object') {\n" +
        "\t\tmodule.exports = factory;\n" +
      "\t} else {\n" +
        "\t\troot.PhotoSwipe = factory();\n" +
      "\t}\n" +
    "})(this, function () {\n\n" +
      "\t'use strict';\n"+
      "\tvar PhotoSwipe = function(template, UiClass, items, options){\n";
      




    if(includes) {
      includes = includes.split(/[\s,]+/); // 'a,b,c' => ['a','b','c']
      var removeA = function (arr) {
          var what, a = arguments, L = a.length, ax;
          while (L > 1 && arr.length) {
              what = a[--L];
              while ((ax= arr.indexOf(what)) !== -1) {
                  arr.splice(ax, 1);
              }
          }
          return arr;
      };

      includes.forEach(function( name ) {
        if(name) {
           
           grunt.log.writeln( 'removed "'+name +'"' );
           files = removeA(files, name);
         }
      });
    }
    
    grunt.log.writeln( 'Your build is made of:'+files );

    files.forEach(function( name ) {
      // Wrap each module with a pience of code to be able to exlude it, stolen for modernizr.com
      newContents += "\n/*>>"+name+"*/\n"; 
      newContents += grunt.file.read( basePath + name + '.js' ) + '\n';
      newContents += "\n/*>>"+name+"*/\n"; 
    });


    newContents+= "\t framework.extend(self, publicMethods); };\n"
    newContents+= "\treturn PhotoSwipe;\n";
    newContents+= "});";


    grunt.file.write( this.data.dest, newContents );

    var uiContents = grunt.file.read( basePath + 'ui/photoswipe-ui-default.js' );
    uiContents = this.data.defaultUIBanner + uiContents;
    grunt.file.write( this.data.uidest, uiContents );
  });





  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-aws-s3');

  // Default task.
  grunt.registerTask('default', ['sass', 'pswpbuild','uglify', 'copy', 'jekyll:dev']);

  grunt.registerTask('production', ['sass', 'pswpbuild', 'uglify', 'copy', 'cssmin', 'jekyll:production']);
  grunt.registerTask('nosite', ['sass', 'pswpbuild', 'uglify']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('awsupload', ['aws_s3']);

};
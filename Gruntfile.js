'use strict';

var path = require('path');
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	 
		vulcanize: {
			default: {
				options: {
					// Task-specific options go here.
					inline: true
				},
				files: {
					// Target-specific file lists and/or options go here.
					'dist/index.html': 'src/index.html'
				},
			},
		},

		watch: {
			css: {
				files: 'src/**/*',
				tasks: ['vulcanize'],
				options: {
					interrupt: true,
					livereload: true,
					debounceDelay: 1000,
				},
			},
		},

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-vulcanize');

	grunt.registerTask('default', ['watch']);

};
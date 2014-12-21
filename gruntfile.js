module.exports = function (grunt) {
    var lessSrc = './src/less/*.less',
        jsFiles = './src/js/*.js';

    grunt.initConfig({
        jshint: {
            dev: [jsFiles]
        },
        less: {
            dev: {
                files: {
                    './src/css/qgrid.css': lessSrc
                }
            }
        },
        watch: {
            dev: {
                files: [lessSrc, jsFiles],
                tasks: ['less', 'jshint']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['watch']);
};
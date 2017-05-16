// RequireJS configuration
requirejs.config({
  // Basic parameters
  nodeRequire: require,
  nodeIdCompat: true,
  
  // Path shortcuts for common used components
  paths: {
    // Utils
    'jquery'         : 'libs/vendor/jquery/jquery',
    'cookie'         : 'libs/vendor/jquery/jquery.cookie',
    'underscore'     : 'libs/vendor/utils/underscore',
    'handlebars'     : 'libs/vendor/utils/handlebars',
    'crypto'         : 'libs/vendor/utils/crypto',
    'text'           : 'libs/vendor/utils/require.text',
    'debug'          : 'libs/vendor/utils/debug',
    'moment'         : 'libs/vendor/utils/moment',
    'clipboard'      : 'libs/vendor/utils/clipboard',
    // Backbone core and plugins
    'backbone'       : 'libs/vendor/backbone/backbone',
    'bb.stickit'     : 'libs/vendor/backbone/stickit',
    'bb.deepmodel'   : 'libs/vendor/backbone/deepmodel',
    'bb.marionette'  : 'libs/vendor/backbone/marionette',
    // UI
    'ui.transition'  : 'libs/vendor/jquery/bootstrap.transition',
    'ui.tooltip'     : 'libs/vendor/jquery/bootstrap.tooltip',
    'ui.dropdown'    : 'libs/vendor/jquery/bootstrap.dropdown',
    'ui.popover'     : 'libs/vendor/jquery/bootstrap.popover',
    'ui.affix'       : 'libs/vendor/jquery/bootstrap.affix',
    'ui.modal'       : 'libs/vendor/jquery/bootstrap.modal',
    'ui.tab'         : 'libs/vendor/jquery/bootstrap.tab',
    'ui.datepicker'  : 'libs/vendor/jquery/bootstrap.datepicker',
    'ui.autocomplete': 'libs/vendor/jquery/jquery.autocomplete.min',
    'ui.toaster'     : 'libs/vendor/jquery/jquery.toaster',
    'ui.accordion'   : 'libs/pixative.accordion',
    'ui.validator'   : 'libs/pixative.validator',
    'ui.map'         : 'libs/vendor/map/leaflet',
    'ui.map.draw'    : 'libs/vendor/map/draw',
    'ui.map.cluster' : 'libs/vendor/map/markercluster',
    // Animation
    'velocity'       : 'libs/vendor/utils/velocity',
    'velocity.ui'    : 'libs/vendor/utils/velocity.ui',
    // App framework
    'valkie'         : 'libs/valkie'
  },

  // Load configuration options for non-module libraries
  shim: {
    // Backbone core and plugins
    'underscore'     : { exports: '_' },
    'backbone'       : { deps: ['jquery','underscore'], exports: 'Backbone' },
    'bb.stickit'     : { deps: ['backbone'] },
    'bb.deepmodel'   : { deps: ['backbone'], exports: 'DeepModel' },
    'bb.marionette'  : { deps: ['backbone'], exports: 'Marionette' },
    // Utils
    'handlebars'     : { exports: 'Handlebars' },
    'crypto'         : { exports: 'CryptoJS' },
    'cookie'         : ['jquery'],
    'moment'         : { exports: 'moment' },
    // UI
    'ui.transition'  : ['jquery'],
    'ui.affix'       : ['ui.transition'],
    'ui.tab'         : ['ui.transition'],
    'ui.dropdown'    : ['ui.transition'],
    'ui.modal'       : ['ui.transition'],
    'ui.tooltip'     : ['ui.transition'],
    'ui.datepicker'  : ['ui.transition'],
    'ui.popover'     : ['ui.tooltip'],
    'ui.toaster'     : ['jquery'],
    'ui.accordion'   : ['jquery'],
    'ui.validator'   : ['jquery'],
    'ui.map'         : { exports: 'L' },
    'ui.map.draw'    : ['ui.map'],
    'ui.map.cluster' : ['ui.map'],
    // Animation
    'velocity'       : ['jquery'],
    'velocity.ui'    : ['velocity']
  }
});

// Load main application file
requirejs(['somosfut']);
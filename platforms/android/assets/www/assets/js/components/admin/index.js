define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:index' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Main component UI and router
  var AdminLayout = require( './views/layout' );
  var AdminRouter = require( './router' );
  
  // Component definition
  var AdminComponent = Valkie.Module.extend({
    startWithParent: false,
    
    initialize: function() {
      debug( 'initializing' );
      
      // Component init state
      this.ui     = null;
      this.router = null;
    },
    
    onBeforeStart: function( options ) {
      debug( 'about to start with options: %o', options );
    },
    
    onStart: function( options ) {
      debug( 'started with options: %o', options );
      
      // Initialize component UI
      this.ui = new AdminLayout();
      options.ui = this.ui;
      
      // Initialize component main router
      this.router = new AdminRouter( options );
    },
    
    onBeforeStop: function( options ) {
      debug( 'about to stop with options: %o', options );
      
      // Cleanup
      this.ui     = null;
      this.router = null;
    },
    
    onStop: function( options ) {
      debug( 'stopped with options: %o', options );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return definition as module export
  module.exports = AdminComponent;
});
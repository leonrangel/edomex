define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:index' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Main component UI and router
  var PlayerLayout = require( './views/layout' );
  var PlayerRouter = require( './router' );
  
  // Component definition
  var PlayerComponent = Valkie.Module.extend({
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
      this.ui = new PlayerLayout();
      options.ui = this.ui;
      
      // Initialize component main router
      this.router = new PlayerRouter( options );
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
  module.exports = PlayerComponent;
});
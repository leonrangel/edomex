// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.tab' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:tabs' );
  
  // Behavior definition
  var TabsBehavior = Valkie.Behavior.extend({
    defaults: {
      togglers: '.tab-toggler'
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.find( this.options.togglers ).click( function( e ){
        e.preventDefault();
        $( this ).tab( 'show' );
      });
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = TabsBehavior;
});

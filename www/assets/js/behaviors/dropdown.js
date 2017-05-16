// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.dropdown' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:dropdown' );
  
  // Behavior definition
  var DropdownBehavior = Valkie.Behavior.extend({
    defaults: {
      selector: '.dropdown'
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      
      // Retrieve toggler element and set the data-toggle attribute, it's
      // required by the bootstrap plugin
      var toggler = this.$el.find( this.options.selector );
      if( ! toggler.data( 'toggle' ) ) {
        toggler.attr( 'data-toggle', 'dropdown' );
      }
      toggler.dropdown();
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = DropdownBehavior;
});

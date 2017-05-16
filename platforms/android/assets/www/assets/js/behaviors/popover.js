// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.popover' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:popover' );
  
  // Behavior definition
  var PopoverBehavior = Valkie.Behavior.extend({
    defaults: {
      'selector'  : '.hasPopover',
      'animation' : true,
      'container' : false,
      'placement' : 'auto',
      'html'      : true,
      'trigger'   : 'click',
      'delay': { 
        'show': 100,
        'hide': 100
      }
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.popover( this.options );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = PopoverBehavior;
});

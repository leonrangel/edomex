// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.tooltip' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:tooltip' );
  
  // Behavior definition
  var TooltipBehavior = Valkie.Behavior.extend({
    defaults: {
      'selector'  : '.hasTip',
      'animation' : true,
      'container' : false,
      'placement' : 'auto',
      'trigger'   : 'hover',
      'delay': { 
        'show': 400,
        'hide': 200
      }
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.tooltip( this.options );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = TooltipBehavior;
});

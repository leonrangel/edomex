// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.affix' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:affix' );
  
  // Behavior definition
  var AffixBehavior = Valkie.Behavior.extend({
    defaults: {
      'selector': '.affixMe',
      'offset'  : 10
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.find( this.options.selector ).affix( this.options );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = AffixBehavior;
});

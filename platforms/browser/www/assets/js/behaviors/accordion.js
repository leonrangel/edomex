// Module definition
define( function( require, exports, module ) {
  'use strict';

  // Module dependencies
  require( 'ui.accordion' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:accordion' );

  // Behavior definition
  var AccordionBehavior = Valkie.Behavior.extend({
    defaults: {
      toggler: 'h3.accordion-header',
      content: 'div.accordion-content',
      animationSpeed: 400,
      animationMode: 'swing',
      openMethod: 'click',
      openClass: 'open',
      allClosed: false
    },

    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.pixativeAccordion( this.options );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return behavior definition as module export
  module.exports = AccordionBehavior;
});

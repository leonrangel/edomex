define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'module:site:views:footer' );
  
  // View definition
  var FooterView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/footer.hbs' ) ),
    
    initialize: function() {
      debug( 'initializing' );
    },
    
    render: function() {
      this.$el.html( this.template() );
      return this;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = FooterView;
});
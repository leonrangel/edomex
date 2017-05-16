define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:info:views:subscribe' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var SubscribeView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/subscribe.hbs' ) ),
    
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
  module.exports = SubscribeView;
});
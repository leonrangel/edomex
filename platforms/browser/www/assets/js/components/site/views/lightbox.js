define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:lightbox' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var LightboxView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/lightbox.hbs' ) ),
    
    behaviors: {
      'modal': {},
    },
    
    ui: {
      'holder': 'span.lightbox-holder'
    },
    
    render: function() {
      debug( 'rendered' );
      this.setElement( this.template() );
      this.bindUIElements();
      
      this.ui.holder.css( 'backgroundImage', this.options.url );
      return this;
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LightboxView;
});
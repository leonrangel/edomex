define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:views:layout' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Layout definition
  var PlayerLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'modalRegion'   : '#modal',
      'headerRegion'  : '#header',
      'contentRegion' : '#content',
      'footerRegion'  : '#footer'
    },
    
    ui: {
      'header'  : '#header',
      'content' : '#content',
      'footer'  : '#footer'
    },
    
    onShow: function() {
      debug( 'displayed' );
      
      // Load basic HTML for the header and footer
      this.ui.header.html( require( 'text!../register/views/templates/header.hbs' ) );
    },
    
    onDestroy: function() {
      debug( 'removed' );
      $( 'body' ).removeClass();
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = PlayerLayout;
});
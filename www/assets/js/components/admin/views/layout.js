define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:admin:views:layout' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // Layout definition
  var AdminLayout = Valkie.LayoutView.extend({
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
  module.exports = AdminLayout;
});
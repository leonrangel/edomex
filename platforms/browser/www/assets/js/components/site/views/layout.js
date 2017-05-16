define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'module:site:views:layout' );
  
  // Child views
  var FooterView    = require( './footer' );
  
  // Layout definition
  var SiteLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'modalRegion'   : '#modal',
      'headerRegion'  : '#header',
      'contentRegion' : '#content',
      'footerRegion'  : '#footer'
    },
    
    initialize: function() {
      debug( 'initializing' );
      
      // Initialize child views
      this.footer   = new FooterView();
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      // Prepare child views for display
      this.footerRegion.show( this.footer );
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = SiteLayout;
});
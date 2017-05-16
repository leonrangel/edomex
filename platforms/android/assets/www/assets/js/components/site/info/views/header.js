define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:info:views:header' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var HeaderView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/header.hbs' ) ),
    
    ui: {
      'navlinks': 'nav.site-navigation ul li a',
    },
    
    render: function() {
      if( this.options.minimal ) {
        this.template = Valkie.template( require( 'text!./templates/headerMin.hbs' ) );
      }
      
      this.$el.html( this.template() );
      this.bindUIElements();
      return this;
    },
    
    markActive: function( section ) {
      this.ui.navlinks.removeClass( 'active' );
      this.ui.navlinks.filter( '[href=#' + section + ']').addClass( 'active' );
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
  module.exports = HeaderView;
});
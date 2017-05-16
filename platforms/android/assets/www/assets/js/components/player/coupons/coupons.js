define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:Coupons' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var Coupons = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/coupons.hbs' ) ),
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = Coupons;
});
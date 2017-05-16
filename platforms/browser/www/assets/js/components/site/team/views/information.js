define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:team:views:information' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TeamInformation = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/information.hbs' ) ),
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.options.team.toJSON() ) );
      this.bindUIElements();
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
  module.exports = TeamInformation;
});
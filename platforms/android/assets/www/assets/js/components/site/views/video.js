define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var debug  = require( 'debug' )( 'module:site:views:video' );
  var Valkie = require( 'valkie' );
  
  // View definition
  var IntroVideoView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/video.hbs' ) ),
    
    behaviors: {
      'modal': {}
    },
    
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
  module.exports = IntroVideoView;
});
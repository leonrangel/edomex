define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'models:post' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Model definition
  var PostModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/post',
    
    defaults: function() {
      return {
        team       : '',
        tournament : '',
        author     : '',
        type       : '',
        date       : null,
        title      : '',
        content    : '',
        extras     : {},
        location   : null
      }
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Model definition as module export
  module.exports = PostModel;
});
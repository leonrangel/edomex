define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:posts' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var PostModel = require( './post' );
  
  // Collection definition
  var PostsCollection = Valkie.Collection.extend({
    model: PostModel,
    
    // Default sort is by descending date value
    comparator: function( model ) {
      return -( new Date( model.get( 'date' ) ).getTime() );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Collection definition as module export
  module.exports = PostsCollection;
});
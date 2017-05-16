define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:finals' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var FriendlyModel = require( './friendly' );
  
  // Collection definition
  var FriendlysCollection = Valkie.Collection.extend({
    model: FriendlyModel,
    
    // Default sort is by descending date value
    // comparator: function( model ) {
    //   return (parseInt(model.get( 'stage' ))); //-( new Date( model.get( 'date' ) ).getTime() );
    // }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Collection definition as module export
  module.exports = FriendlysCollection;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:matches' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var MatchModel = require( './match' );
  
  // Collection definition
  var MatchesCollection = Valkie.Collection.extend({
    model: MatchModel,
    
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
  module.exports = MatchesCollection;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:finals' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var FinalModel = require( './final' );
  
  // Collection definition
  var FinalsCollection = Valkie.Collection.extend({
    model: FinalModel,
    
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
  module.exports = FinalsCollection;
});
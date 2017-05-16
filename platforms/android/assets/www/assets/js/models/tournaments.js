define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:tournaments' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var TournamentModel = require( './tournament' );
  
  // Collection definition
  var TournamentsCollection = Valkie.Collection.extend({
    model: TournamentModel
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Collection definition as module export
  module.exports = TournamentsCollection;
});

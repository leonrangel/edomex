define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:teams' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var TeamModel = require( './team' );
  
  // Collection definition
  var TeamsCollection = Valkie.Collection.extend({
    model: TeamModel
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Collection definition as module export
  module.exports = TeamsCollection;
});

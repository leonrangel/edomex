define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:tournamentCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/tournamentCell.hbs' ) ),
    
    initialize: function() {
      debug( 'initializing' );
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
  
  // View definition as module export
  module.exports = TournamentCell;
});
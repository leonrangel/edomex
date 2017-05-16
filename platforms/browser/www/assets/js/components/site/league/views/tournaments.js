define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:tournaments' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var TournamentCell  = require( './tournamentCell' );
  
  // View definition
  var LeagueTournaments = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/tournaments.hbs' ) ),
    childView: TournamentCell,
    childViewContainer: 'div.list-wrapper ul',
    
    childEvents: {
      'details': function( cell ) {
        this.trigger( 'details', cell.model );
      }
    },
    
    onRender: function() {
      debug( 'rendered' );
      this.bindUIElements();
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
  module.exports = LeagueTournaments;
});
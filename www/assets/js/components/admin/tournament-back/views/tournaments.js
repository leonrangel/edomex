define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:tournaments' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var TournamentCell = require( './tournamentsCell' );

  // View definition
  var TournamentsList = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/tournaments.hbs' ) ),
    childView: TournamentCell,
    childViewContainer: 'div.tournamets-cards-list div.cols-12',

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
  module.exports = TournamentsList;
});
define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:teams' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var TeamCell = require( './teamsCell' );

  // View definition
  var TeamsList = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/teams.hbs' ) ),
    childView: TeamCell,
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
  module.exports = TeamsList;
});
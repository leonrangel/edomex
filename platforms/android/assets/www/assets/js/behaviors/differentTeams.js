// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var _      = require( 'underscore' );
  var debug  = require( 'debug' )( 'behavior:differentTeams' );
  
  // Behavior definition
  var DifferentTeamsBehavior = Valkie.Behavior.extend({
    events: {
      "change @ui.teamA" : 'checkForDifferentTeams',
      "change @ui.teamB" : 'checkForDifferentTeams'
    },

    checkForDifferentTeams: function() {
      var teamA = this.view.ui.teamA;
      var teamB = this.view.ui.teamB;

      debug( 'checking for team %o and team %o', teamA.val(), teamB.val() );

      _.each( [teamA, teamB], function( team ) {
        team
          .removeAttr( 'data-validator-custom' )
          .removeAttr( 'custom-message' );
      });

      if ( teamA.val() === teamB.val() ) {
        _.each( [teamA, teamB], function( team ) {
          team
            .attr( 'data-validator-custom', '' )
            .attr( 'custom-message', 'SAME_TEAM_SELECTED' );
        });       
      }
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = DifferentTeamsBehavior;
});

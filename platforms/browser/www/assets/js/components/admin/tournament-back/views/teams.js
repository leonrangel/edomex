define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:teams' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentTeams = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/teams.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    render: function() {
      this.setElement( this.template( this.options.item.toJSON() ) );
      this.bindUIElements();
      return this;
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
  module.exports = TournamentTeams;
});
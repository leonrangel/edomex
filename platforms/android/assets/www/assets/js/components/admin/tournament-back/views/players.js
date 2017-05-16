define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:players' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentPlayers = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/players.hbs' ) ),
    
    render: function() {
      this.setElement( this.template({
        players: this.options.players.toJSON()
      }) );
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
  module.exports = TournamentPlayers;
});
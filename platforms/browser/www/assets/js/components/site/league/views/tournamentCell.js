define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:tournamentCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/tournamentCell.hbs' ) ),
    tagName: 'li',
    
    ui: {
      'link' : 'a'
    },
    
    events: {
      'click @ui.link': function( e ) {
        e.preventDefault();
        this.trigger( 'details', this );
      }
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
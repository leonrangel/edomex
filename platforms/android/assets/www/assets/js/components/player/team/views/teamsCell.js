define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:teamCell' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // View definition
  var TeamCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/teamCell.hbs' ) ),
    
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
  module.exports = TeamCell;
});
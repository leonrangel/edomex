define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:statistics' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentStats = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/statistics.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    render: function() {
      debug( 'redering with data: %o', this.options.data );
      this.setElement( this.template( this.options.data ) );
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
  module.exports = TournamentStats;
});
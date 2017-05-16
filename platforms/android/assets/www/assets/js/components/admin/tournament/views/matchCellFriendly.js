define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:matchCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var MatchCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/matchCellFriendly.hbs' ) ),

    render: function() {

      this.setElement( this.template( this.model.toJSON() ) );
      this.bindUIElements();

      return this;
    },
    
    ui: {
      'edit'    : 'button.editar',
      'results' : 'button.resultados'
    },
    
    events: {
      'click @ui.edit'    : 'edit',
      'click @ui.results' : 'results'
    },
    
    edit: function( e ) {
      debug( 'trigger edit match event' );
      e.preventDefault();
      this.trigger( 'details:edit', this );
    },
    
    results: function( e ) {
      debug( 'trigger capture results event' );
      e.preventDefault();
      this.trigger( 'details:result', this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // View definition as module export
  module.exports = MatchCell;
});
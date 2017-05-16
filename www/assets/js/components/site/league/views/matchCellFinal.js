define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:matchCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  

  var stages = [
    'Final',
    'Tercer lugar',
    'Semifinal',
    'Cuartos de final',
    'Octavos de final',
    'Dieciseisavos de final '
  ];
  // View definition
  var MatchCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/matchCellFinal.hbs' ) ),
    
    ui: {
      'edit'    : 'button.editar',
      'results' : 'button.resultados'
    },
    
    render : function(){
      var data = this.model.toJSON();
      var stage = data.stage;
      var lbs = data.tmpLabel.split(':');

      if (!data.teamA){
        data.teamA = {name : lbs[0]};
      }

      if (!data.teamB){
        data.teamB = {name : lbs[1] ? lbs[1] : lbs[0]};
      }

      this.setElement( this.template( data ) );
      this.bindUIElements();

      return this;
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
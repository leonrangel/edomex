define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:matchCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var MatchCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/matchCell.hbs' ) ),

    render: function() {

      var data = this.model.toJSON();

      data.dynLabel = '';
      if (data.results.dynPointsA) {
        if (data.results.dynPointsA !== 0){
          data.dynLabel += data.results.dynPointsA > 0 ? (''+data.teamA.name+'<b> +'+data.results.dynPointsA+'</b> puntos por: <b>'+data.results.dynPointsStrA+'</b>') : (''+data.teamA.name+'<b> '+data.results.dynPointsA+'</b> puntos por: <b>'+data.results.dynPointsStrA+'</b>');
        }

        if (data.results.dynPointsB !== 0){
          if (data.dynLabel != '') data.dynLabel += '</br>';
          data.dynLabel += data.results.dynPointsB > 0 ? (''+data.teamB.name+' +'+data.results.dynPointsB+'</b> puntos por: <b>'+data.results.dynPointsStrB+'</b>') : (''+data.teamB.name+'<b>  '+data.results.dynPointsB+'</b> puntos por: <b>'+data.results.dynPointsStrB+'</b>');
        }
      }
      

      this.setElement( this.template( data ) );
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
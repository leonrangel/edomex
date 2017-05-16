define( function( require, exports, module ) {
  'use strict';

  // Module dependencies
  var debug  = require( 'debug' )( 'module:admin:tournament:views:newTournament' );
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );

  // View definition
  var NewTournamentForm = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/newTournament.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'datepicker': {
        selector: '.input-daterange',
        startDate: '-1y',
        endDate: '+1y',
        autoclose: false
      },
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form': 'form'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'submit new tournament data' );
      var data = {
        name  : this.ui.form.find( 'input[name="name"]' ).val(),
        type  : this.ui.form.find( 'select[name="type"]' ).val(),
        slots : this.ui.form.find( 'input[name="slots"]' ).val(),
        startDate : new Date( this.ui.form.find( 'input[name="startDate"]' ).val() ),
        endDate : new Date( this.ui.form.find( 'input[name="endDate"]' ).val() )
      };
      
      data.participants = [];
      for( var i = 0; i < data.slots; i++ ) {
        data.participants.push({
          team: null,
          token: utils.makeToken()
        });
      }
      
      this.trigger( 'submit', data );
      this.$el.modal( 'hide' );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = NewTournamentForm;
});
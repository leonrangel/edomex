define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:team:views:joinTournament' );
  
  // Module dependencies
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  
  // View definition
  var JoinTournamentView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/joinTournament.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form' : 'form',
      'token' : 'input[name=token]'
    },

    initialize: function (options) {
      debug('initialize with options %o', options);

      this.team = options.team;
    },

    onBeforeShow: function () {
      debug('on before show');

      // Prevent close if its necessary (means that the user dont
      // have created a team)
      this.$el.on('hide.bs.modal', _.bind( function (event) {
        if (this.team.get('tournaments').length === 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, this ));
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'join tournament %s', this.ui.token.val() );
      this.trigger( 'submit', this.ui.token.val(), this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = JoinTournamentView;
});
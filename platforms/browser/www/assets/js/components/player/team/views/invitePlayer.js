define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:team:views:invitePlayer' );
  
  // Module dependencies
  var Valkie    = require( 'valkie' );
  var Clipboard = require( 'clipboard' );
  
  // View definition
  var InvitePlayerView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/invitePlayer.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'tooltip': {
        'selector'  : 'a.copy-token',
        'trigger'   : 'focus',
        'placement' : 'bottom',
        'title'     : '¡Código Copiado, Compártelo!',
        'delay'     : {
          'show' : 100,
          'hide' : 500
        }
      },
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'      : 'form',
      'email'     : 'input[name=email]',
      'clearTour' : 'a.dont-show',
      'copyToken' : 'a.copy-token'
    },

    events: {
      'click @ui.clearTour' : 'clearTour',
      'click @ui.copyToken' : 'copyToken'
    },
    
    initialize: function( options ) {
      this.team = options.team;
    },
    
    render: function() {
      this.setElement( this.template({ token: this.team.get( 'token' ) }) );
      this.bindUIElements();
      return this;
    },

    onBeforeShow: function () {
      debug('about to be shown');

      // If theres not tour dont show stop tours
      if (this.team.get('tours')['playerInvitation']) {
        this.ui.clearTour.hide();
      }

      // Add clipboard behaviour
      this.tokenClipboard = new Clipboard(this.ui.copyToken[0]);
      this.tokenClipboard.on('success', function (event) {
        event.clearSelection();
      }, this);
    },
    
    submit: function() {
      debug( 'send invitation to %s', this.ui.email.val() );
      this.trigger( 'submit', this.ui.email.val() );
      this.$el.modal( 'hide' );
    },

    clearTour: function(event) {
      event.preventDefault();
      this.trigger('tours:clear', 'playerInvitation');
      this.$el.modal('hide');
    },

    copyToken: function (event) {
      event.preventDefault();
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return View definition as module export
  module.exports = InvitePlayerView;
});
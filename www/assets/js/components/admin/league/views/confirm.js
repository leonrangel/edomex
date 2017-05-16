define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:views:confirm' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // View definition
  var ConfirmView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/confirm.hbs' ) ),

    behaviors: {
      'modal': {}
    },

    ui: {
      'form'    : 'form',
      'confirm' : 'input[name="confirm"]',
      'cancel'  : 'input[name="cancel"]'
    },

    events: {
      'click @ui.confirm' : 'confirm',
      'click @ui.cancel'  : 'cancel'
    },

    render: function() {
      this.setElement( this.template( this.options ) );
      this.bindUIElements();
      return this;
    },

    cancel: function(e) {
      debug( 'cancel' );
      this.trigger( 'cancel', this );

      e.preventDefault();
    },

    confirm: function(e) {
      debug( 'confirm' );
      this.trigger( 'confirm', this );

      e.preventDefault();
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = ConfirmView;
});

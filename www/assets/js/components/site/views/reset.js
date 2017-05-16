define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:reset' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var ResetPassForm = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/reset.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'  : 'form',
      'email' : 'input[name=email]'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'fire submit event with credentials: %o', this.ui.email.val() );
      this.trigger( 'submit', this.ui.email.val() );
      this.$el.modal( 'hide' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = ResetPassForm;
});
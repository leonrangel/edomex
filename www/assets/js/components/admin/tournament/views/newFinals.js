define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newImage' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewImageView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newFinals.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      stage : '[name="stage"]'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'submit form' );
    
      this.trigger( 'submit', this.ui.stage.val() );
      this.$el.modal( 'hide' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewImageView;
});
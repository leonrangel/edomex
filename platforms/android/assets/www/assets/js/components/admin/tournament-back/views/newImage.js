define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newImage' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewImageView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newImage.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form' : 'form'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'submit form' );
      
      var data = new FormData( this.ui.form[0] );
      data.append( 'date',  Date.now() );
      
      this.trigger( 'submit', data );
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
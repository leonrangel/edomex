define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newPost' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewPostView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newPost.hbs' ) ),
    
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
      this.setElement( this.template( this.options ) );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'submit form' );
      var data = {
        'type'    : 'news',
        'title'   : this.ui.form.find( 'input[name="title"]' ).val(),
        'content' : this.ui.form.find( 'textarea[name="content"]' ).val(),
      };
      this.trigger( 'submit', data );
      this.$el.modal( 'hide' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewPostView;
});
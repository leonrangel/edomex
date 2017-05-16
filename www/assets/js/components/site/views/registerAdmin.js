define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:registerAdmin' );

  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  var Crypto = require( 'crypto' );

  // View definition
  var RegisterAdminForm = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/registerAdmin.hbs' ) ),

    behaviors: {
      'modal': {},
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
      var admin = {};
      var data = this.ui.form.serializeArray();
      data.forEach( function( el ){
        admin[el.name] = el.value;
      });
      admin.password = Crypto.SHA512( admin.password ).toString();
      
      // Remove passwd confirmation field from the user hash
      delete admin['pwdConf'];
      
      // Send request to the backend
      $.ajax({
        url: '/league/bootstrap',
        type: 'POST',
        async: true,
        data: JSON.stringify( admin ),
        contentType: 'application/json',
        context: this
      }).done( function() {
        this.$el.modal( 'hide' );
      });
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = RegisterAdminForm;
});
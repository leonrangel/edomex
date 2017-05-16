define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:mobileLogin' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var Crypto = require( 'crypto' );

  

  // View definition
  var MobileLoginForm = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/mobileLogin.hbs' ) ),

    behaviors: {
      'validator': {
        successHandler: 'submit'
      }
    },

    ui: {
      'form': '#login-form',
      'fbLoginBtn': '.fb-login',
    },

    events: {
      'click @ui.fbLoginBtn': 'fbLogin'
    },

    render: function() {
      this.$el.html( this.template() );
      this.bindUIElements();
      return this;
    },


    submit: function() {
      var credentials = {
        'email': this.ui.form.find( 'input[name=email]' ).val(),
        'pass' : this.ui.form.find( 'input[name=pass]' ).val()
      };
      credentials.pass = Crypto.SHA512( credentials.pass ).toString();

      debug( 'fire submit event with credentials: %o', credentials );
      this.trigger( 'submit', credentials );
    },

    fbLogin: function (event) {
      event.preventDefault();
      var self = this;

      facebookConnectPlugin.login(['public_profile,email'],
      function (res) {
        if (res.authResponse) {
          self.trigger('handleFacebookLogin', res.authResponse)
        }
      },
      function (err) {});
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = MobileLoginForm;
});

define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:login' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var Crypto = require( 'crypto' );
  
  // View definition
  var LoginFormView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/login.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'validator': {
        successHandler: 'submit'
      },
      tooltip: {}
    },
    
    ui: {
      'form': 'form',
      'fbLoginBtn': '.fb-login',
      'toggle'  : 'a.login-active',
      'menu'    : '.form-login',

    },

    events: {
      'click @ui.fbLoginBtn': 'fbLogin',
      'click @ui.toggle' : 'toggleLogin'
    },
    
    render: function() {
      this.setElement( this.template() );
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
      this.$el.modal( 'hide' );
    },

    fbLogin: function (event) {
      event.preventDefault()
      var self = this

      FB.login(function (res) {
        if (res.authResponse) {
          self.trigger('handleFacebookLogin', res.authResponse)
          self.$el.modal('hide')
        }
      }, {
        scope: 'public_profile,email'
      })
    },


 toggleLogin: function( e ) {
      debug( 'toggle login' );
      e.preventDefault();
      this.ui.menu.toggleClass( 'form-login-hide' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LoginFormView;
});
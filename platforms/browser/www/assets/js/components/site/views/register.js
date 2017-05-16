define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var debug    = require( 'debug' )( 'module:site:views:register' );
  var Valkie   = require( 'valkie' );
  var Crypto   = require( 'crypto' );
  var mediator = require( 'mediator' );
  
  // View definition
  var RegisterFormView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/register.hbs' ) ),
    
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
      'toggle'  : 'a.register-active',
      'menu'    : '.form-register',
    },

    events: {
      'click @ui.fbLoginBtn': 'fbLogin',
      'click @ui.toggle' : 'toggleRegister'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    fbLogin: function (event) {
      event.preventDefault();
      var self = this;

      if (mediator.inPhoneGap()) {
        facebookConnectPlugin.login(['public_profile,email'],
        this.fbLoginSuccess.bind(this),
        function (err) {
        });
      } else {
        FB.login(this.fbLoginSuccess.bind(this), {
          scope: 'public_profile,email'
        });
      }
    },

    fbLoginSuccess: function (res) {
      if (res.authResponse) {
        this.trigger('handleFacebookLogin', res.authResponse);

        if (!mediator.inPhoneGap()) {
          this.$el.modal('hide');
        }
      }
    },

    submit: function() {
      var user = {};
      var data = this.ui.form.serializeArray();
      data.forEach( function( el ){
        user[el.name] = el.value;
      });
      user.password = Crypto.SHA512( user.password ).toString();
      
      // Remove passwd confirmation field from the user hash
      delete user['pwdConf'];
      
      debug( 'fire submit event with data: %o', user );
      this.trigger( 'submit', user );
      this.$el.modal( 'hide' );
    },
  
  toggleRegister: function( e ) {
      debug( 'toggle register' );
      e.preventDefault();
      this.ui.menu.toggleClass( 'form-register-hide' );
    }
  });
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = RegisterFormView;
});
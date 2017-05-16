define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'app:mediator' );
  
  // Module dependencies
  require( 'cookie' );
  var $  = require( 'jquery' );
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  var UserModel = require( 'models/user' );
  
  // Global communications channel
  var channel = Valkie.radio.channel( 'global' );
  
  // Mediator definition
  var Mediator = Valkie.Object.extend({
    userLocation: false,
    commands: channel.commands,
    
    // Setup
    initialize: function() {
      // Configure session cookie
      $.cookie.json = true;
      
      // Start user holder
      this.user = new UserModel();
      
      // Load existing session data if any
      var session = this.session();
      if( session ) {
        this.user.set( session.user, {
          silent: true
        });
        
        this.user.fetch({ async: false });
      }
      
      // Display status notifications from the user model
      this.user.on( 'notify', function( e ) {
        debug( 'displaying notification for: %o', e );
        utils.message( e.status, e.status.toUpperCase(), e.desc );
      });
      
      // Update session data when the user holde changes
      this.user.on( 'change', this.updateSession, this );
      
      var self = this;
      // Setup commands handlers
      channel.commands.setHandlers({
        'startSession': function( session ) {
          utils.message( 'success', 'Exito', 'SESSION_STARTED' );
          self.storeSession( session );
          self.user.set( session.user );
          self.trigger( 'reload', { force:true } );
        },
        'endSession': function() {

          // Get session credentials
          var session = self.session();
          var credentials = {
            token: session.token,
            user : session.user._id
          };

          // FB logout in phonegap
          if (self.inPhoneGap()) {
            facebookConnectPlugin.getLoginStatus(function () {
              facebookConnectPlugin.logout(function () {
                debug('logout facebook login');
              }, function (e) {
                debug('%o', e);
              });
            }, function (e) {
              debug('%o', e);
            });
          }
          
          // Execute logout on the user
          self.user.logout( credentials, function (ok) {
            if (ok) {
              utils.message( 'success', 'Exito', 'SESSION_ENDED' );
            }
            
            self.clearSession();
            self.user = new UserModel();
            self.trigger( 'reload', { force:true } );
          });
        },
        'reload': function() {
          self.trigger( 'reload', { force:true } );
        }
      });
    },
    
    // Initiate the storage of a new session
    storeSession: function( session ) {
      if( this.inPhoneGap() ) {
        window.localStorage.setItem( 'session', JSON.stringify( session ) );
      } else {
        $.cookie( 'somosfut.com', session, { expires: 7, path: '/' });
      }
    },
    
    // Update session data
    updateSession: function() {
      debug( 'updating session data' );
      var session  = $.cookie( 'somosfut.com' );
      if( session ) {
        session.user = this.user.toJSON();
        this.storeSession( session );
      }
    },
    
    // Remove stored session data
    clearSession: function() {
      if( this.inPhoneGap() ) {
        window.localStorage.removeItem( 'session' );
      } else {
        $.removeCookie( 'somosfut.com', { path: '/' });
      }
    },
    
    // Get existing session data
    session: function() {
      // Retrieve session data
      var data = false;
      if( this.inPhoneGap() ) {
        data = JSON.parse( window.localStorage.getItem( 'session' ) );
      } else {
        data = $.cookie( 'somosfut.com' );
      }
      
      return data;
    },
    
    // Utility method to determine when running in phonegap environment
    inPhoneGap: function() {
      var test1 = document.URL.indexOf( 'http://' ) === -1;
      var test2 = document.URL.indexOf( 'https://' ) === -1;
      return test1 && test2;
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return mediator instance ( singleton ) as module export
  module.exports = new Mediator();
});

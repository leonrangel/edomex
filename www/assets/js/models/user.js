define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug  = require( 'debug' )( 'models:user' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // Model definition
  var UserModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/user',

    defaults: function() {
      return {
        name             : '',
        lastnameFather   : '',
        lastnameMother   : '',
        email            : '',
        password         : '',
        mobile           : '',
        postal           : 0,
        uuid             : '',
        verified         : 0,
        type             : 'player',
        authToken        : '',
        lastSession      : null,
        registrationDate : null,
        avatar           : '',
        key              : '',
        teams            : [],
        extras           : {
          filled : false
        },
        info             : {
          gender   : 'male',
          birthday : null,
          country  : '',
          stature  : '',
          weigth   : '',
          number   : '',
          position : '',
          profile  : '',
          nickname : ''
        }
      }
    },

    // Load user details based on a provided URL value
    // @param  string    Value to use for the URL param
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    getFromURL: function( val, done, scope ) {
      debug( 'get user record using URL value: %s', val );
      this._sendRequest({
        data: { url: val },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( response ) {
          if( response.length === 0 ) {
            // No user found? Notify error
            this._notifyError({
              status: 'error',
              desc: 'INVALID_URL'
            });
          } else {
            // Load the retrieved attributes
            this.set( response[0] );
            if( done ) {
              done.call( scope || this, true );
            }
          }
        }
      });
    },

    facebookLogin: function (data, done) {
      this._sendRequest({
        url : 'https://www.somosfut.com/oauth/facebook',
        type: 'POST',
        data: data,
        error: function( req ) {
          this._notifyError( req.responseJSON );
        },
        success: function( session ) {
          done(session);
        }
      });
    },

    // Perform the process of registering a user account
    // @param  object    User details
    register: function( data ) {
      debug( 'request registering user: %o', data );
      this.save( data, {
        wait: true,
        error: function( model, req ) {
          model.trigger( 'notify', req.responseJSON );
        },
        success: function( model ) {
          model.trigger( 'notify', { status:'success', desc:'ACCOUNT_REGISTERED' });
        }
      });
    },

    // Start a new session for the user
    // @param  object    Credentials object
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    login: function( credentials, done, scope ) {
      debug( 'request new session using credentials: %o', credentials );
      this._sendRequest({
        url : 'https://www.somosfut.com/session/',
        type: 'POST',
        data: credentials,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( session ) {
          done.call( scope || this, session );
        }
      });
    },

    // Terminate an existing session for the user
    // @param  object    Credentials object
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    logout: function( credentials, done, scope ) {
      debug( 'request terminating session: %o', credentials );
      this._sendRequest({
        url: 'https://www.somosfut.com/session',
        type: 'DELETE',
        data: credentials,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( response ) {
          done.call( scope || this, true );
        }
      });
    },

    // Try to mark an account as verified based on a given token
    // @param  string    Verification token
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    verify: function( token, done, scope ) {
      debug( 'try user verification using token: %s', token );
      this._sendRequest({
        url : this.urlRoot + '/verify',
        type: 'POST',
        data: { token: token },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( session ) {
          done.call( scope || this, session );
        }
      });
    },

    // Store a new avatar for the user
    // @param  object    FormData object containing the 'avatar' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    uploadAvatar: function( data, done, scope ) {
      debug( 'uploading new avatar: %o', data );
      this._sendRequest({
        url: this.url() + '/avatar',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( response ) {
          this.set( 'avatar', response.avatar );
          done.call( scope || this, true );
        }
      });
    },

    uploadIFE: function( data, done, scope ) {
      debug( 'uploading new ife: %o', data );
      this._sendRequest({
        url: this.url() + '/ife',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( response ) {
          this.set( 'extras.ife', response.avatar );
          done.call( scope || this, true );
        }
      });
    },

    // Store a new front image for the user
    // @param  object    FormData object containing the 'front' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    uploadFront: function( data, done, scope ) {
      debug( 'uploading new front image: %o', data );
      this._sendRequest({
        url: this.url() + '/front',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( response ) {
          this.set( 'front', response.front );
          done.call( scope || this, true );
        }
      });
    },

    // Validate if user data is available based on some search criteria,
    // for example send a 'url' to validate a profile access token
    // @param  object    Query data
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    isAvailable: function( data, done, scope ) {
      debug( 'checking if user is available: %o', data );
      this._sendRequest({
        url: this.urlRoot + '/available',
        type: 'GET',
        data: data,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          done.call( scope || this, false );
        },
        success: function( result ) {
          done.call( scope || this, result );
        }
      });
    },

    // Affiliate the user to an existing team based on the team's
    // access token
    // @param  token     Team's access token
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    joinTeam: function( token, done, scope ) {
      debug( 'request to join team: %s', token );
      this._sendRequest({
        url: this.url() + '/jointeam',
        type: 'POST',
        data: { token: token },
        error: function( req ) {
          done.call( scope || this, false );
        },
        success: function( team ) {
          this.get( 'teams' ).push( team );
          done.call( scope || this, team );
        }
      });
    },

    // Resets a user's password based on it's email address
    // @param  email     Email address to use
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    resetPass: function( email, done, scope ) {
      debug( 'request to reset password for: %s', email );
      this._sendRequest({
        url: this.urlRoot + '/resetPass',
        type: 'POST',
        data: { email: email },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function() {
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },

    // Resends a user's activation email based on it's email address
    // @param  email     Email address to use
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    resendActivation: function( email, done, scope ) {
      debug( 'request to resend activatioin email to: %s', email );
      this._sendRequest({
        url: this.urlRoot + '/resendActivation',
        type: 'POST',
        data: { email: email },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function() {
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },

    // Add a device token to the user account to receive push notifications
    // access token
    // @param  token     Device token
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    addDeviceToken: function( token, done, scope ) {
      debug( 'store device token: %s', token );
      this._sendRequest({
        url: this.url() + '/deviceToken',
        type: 'POST',
        data: { token: token },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, true );
          }
        },
        success: function() {
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },

    clearTours: function (tourName) {
      this._sendRequest({
        url: '/user/tours',
        type: 'POST',
        data: {
          user: this.get('_id'),
          tourName: tourName
        },
        error: function( req ) {
          this._notifyError( req.responseJSON );
        },
        success: function( response ) {
        }
      });
    },

    // Bring up the leagues array merging the leagues of each team
    getLeagues: function (user) {
      var leagues = [];
      this.get('teams').forEach(function (team) {
        team.tournaments.forEach(function (tournament) {
          var duplicate = false;
          for (var i = 0; i < leagues.length; i++) {
            if (leagues[i]._id === tournament.league._id) {
              duplicate = true;
            }
          }

          if (!duplicate) {
            leagues.push(tournament.league);
          }
        });
      });

      return leagues;
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return model definition as module export
  module.exports = UserModel;
});

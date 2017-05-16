define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:team' );
  
  // Module dependencies
  var _ = require( 'underscore' );
  var Valkie = require( 'valkie' );
  
  // Model definition
  var TeamModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/team',
    
    defaults: function() {
      return {
        name        : '',
        uuid        : '',
        token       : '',
        avatar      : '',
        admins      : [],
        tournaments : [],
        extras      : {},
        tours       : {
          playerInvitation : false
        }
      }
    },
    
    // Load team details based on a provided URL value
    // @param  string    Value to use for the URL param
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    getFromURL: function( val, done, scope ) {
      debug( 'get team record using URL value: %s', val );
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
            
            if( done ) {
              done.call( scope || this, false );
            }
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
    
    // Store a new avatar for the team
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
    
    // Store a new front image for the team
    // @param  object    FormData object containing the 'front' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    uploadFrontImage: function( data, done, scope ) {
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
          var extras   = this.get( 'extras' );
          extras.front = response.front;
          this.set( 'extras', extras );
          done.call( scope || this, true );
        }
      });
    },
    
    // Add a new admin user to the team instance
    // @param  object    New admin ID to add
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    addAdmin: function( admin, done, scope ) {
      var admins = this.get( 'admins' );
      
      // Is the admin already set ?
      if( _.indexOf( admins, admin ) ) {
        model.trigger( 'notify', { status:'error', desc:'ADMIN_ALREADY_ADDED' });
        done.call( scope || this, false );
        return;
      }
      
      // Admin user and update model
      admins.push( admin );
      this.patch({
        'admins': admins
      },{
        wait: true,
        error: function( model, req ) {
          model.trigger( 'notify', req.responseJSON );
          done.call( scope || model, false );
        },
        success: function( model ) {
          model.trigger( 'notify', { status:'success', desc:'ADMIN_ADDED' });
          done.call( scope || model, true );
        }
      });
    },
    
    // Remove a previously set admin user from the team instance
    // @param  object    Admin ID to remove
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    removeAdmin: function( admin, done, scope ) {
      var admins = this.get( 'admins' );
      
      // Is the admin not set ?
      var index = _.indexOf( admins, admin );
      if( ! index ) {
        model.trigger( 'notify', { status:'error', desc:'ADMIN_NOT_ADDED' });
        done.call( scope || this, false );
        return;
      }
      
      // Remove user and update model
      admins.splice( index, 1 );
      this.patch({
        'admins': admins
      },{
        wait: true,
        error: function( model, req ) {
          model.trigger( 'notify', req.responseJSON );
          done.call( scope || model, false );
        },
        success: function( model ) {
          model.trigger( 'notify', { status:'success', desc:'ADMIN_REMOVED' });
          done.call( scope || model, true );
        }
      });
    },
    
    // Validate if team data is available based on some search criteria,
    // for example send a 'url' to validate a profile access token
    // @param  object    Query data
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    isAvailable: function( data, done, scope ) {
      debug( 'checking if team is available: %o', data );
      this._sendRequest({
        url: 'https://www.somosfut.com/available',
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
    
    // Save a new post for the team instance
    // @param  object    New post details
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    savePost: function( data, done, scope ) {
      debug( 'saving new post with data: %o', data );
      this._sendRequest({
        url: this.url() + '/post',
        type: 'POST',
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
    
    // Send a invitation to a provided address
    // @param  string    Email address to use
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    sendInvitation: function( email, done, scope ) {
      debug( 'sending team invitation to: %s', email );
      this._sendRequest({
        url: this.url() + '/invite',
        type: 'POST',
        data: { email: email },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( res ) {
          this._notifySuccess( 200, 'Ok', 'TEAM_INVITATION_SENDED' );
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },
    
    // Affiliate the team to an existing tournament based on it's
    // access token
    // @param  token     Tournament's access token
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    joinTournament: function( token, done, scope ) {
      debug( 'request to join team: %s', token );
      this._sendRequest({
        url: this.url() + '/jointournament',
        type: 'POST',
        data: { token: token },
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, req.responseJSON, null  );
          }
        },
        success: function( tournament ) {
          this.get( 'tournaments' ).push( tournament );
          if( done ) {
            done.call( scope || this, false, tournament );
          }
        }
      });
    },
    
    getTournaments: function( done, scope ) {
      debug( 'get tournaments information' );
      this._sendRequest({
        url: this.url() + '/tournaments',
        type: 'GET',
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( data ) {
          if( done ) {
            done.call( scope || this, data );
          }
        }
      });
    },

    clearTours: function (tourName) {
      this._sendRequest({
        url: this.urlRoot + '/tours',
        type: 'POST',
        data: {
          team: this.get('_id'),
          tourName: tourName
        },
        error: function( req ) {
          this._notifyError( req.responseJSON );
        },
        success: function( response ) {
        }
      });
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return model definition as module export
  module.exports = TeamModel;
});

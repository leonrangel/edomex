define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:league' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Model definition
  var LeagueModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/league',
    
    defaults: function() {
      return {
        name        : '',
        uuid        : '',
        avatar      : '',
        description : '',
        url         : '',
        admins      : [],
        extras      : {},
        address     : '',
        location    : {
          lat      : '',
          long     : '',
          accuracy : 0
        },
        contact     : {
          name     : '',
          phone    : '',
          mobile   : '',
          email    : ''
        }
      };
    },
    
    // Load league details based on a provided URL value
    // @param  string    Value to use for the URL param
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    getFromURL: function( val, done, scope ) {
      debug( 'get league record using URL value: %s', val );
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
            this._notifyError( {
              status: 'error',
              desc: 'INVALID_URL'
            } );

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
    
    // Store a new avatar for the league
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
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( response ) {
          this.set( 'avatar', response.avatar );
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },
    
    // Store a new front image for the league
    // @param  object    FormData object containing the 'front' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    uploadFrontImage: function( data, done, scope ) {
      debug( 'uploading new front: %o', data );
      this._sendRequest({
        url: this.url() + '/front',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( response ) {
          var extras   = this.get( 'extras' );
          extras.front = response.front;
          
          this.set( 'extras', extras );
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },
    
    // Store a new location image for the league
    // @param  object    FormData object containing the 'front' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    uploadLocationImage: function( data, done, scope ) {
      debug( 'uploading new loaction: %o', data );
      this._sendRequest({
        url: this.url() + '/location',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( response ) {
          var extras = this.get( 'extras' );
          extras.croquis = [ response.avatar ];

          this.set( 'extras', extras );
          if( done ) {
            done.call( scope || this, true );
          }
        }
      });
    },
    
    // Validate if league data is available based on some search criteria,
    // for example send a 'url' to validate a profile access token
    // @param  object    Query data
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    isAvailable: function( data, done, scope ) {
      debug( 'checking if league is available: %o', data );
      this._sendRequest({
        //url: 'http://www.somosfut.com/league/available',
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
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return Model definition as module export
  module.exports = LeagueModel;
});

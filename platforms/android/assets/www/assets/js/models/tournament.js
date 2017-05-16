define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:tournament' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Model definition
  var TournamentModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/tournament',
    
    defaults: function() {
      return {
        name         : '',
        type         : '',
        avatar       : '',
        league       : '',
        uuid         : '',
        startDate    : null,
        endDate      : null,
        slots        : 0,
        extras       : {},
        participants : []
      };
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
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( response ) {
          this.set( 'avatar', response.avatar );
          if( done ) {
            done.call( scope || this, true );
          }q
        }
      });
    },
    
    // Add a new image to the tournament gallery
    // @param  object    FormData object containing the 'photo' file
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    addImage: function( data, done, scope ) {
      debug( 'uploading new image to gallery' );
      this._sendRequest({
        url: this.url() + '/gallery',
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
          this._notifySuccess( 'CHANGES_STORED' );
          if( done ) {
            done.call( scope || this, response );
          }
        }
      });
    },
    
    // Store a new match record for the tournament
    // @param  object    Match details
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    addMatch: function( data, done, scope ) {
      debug( 'creating new match record: %o', data );
      this._sendRequest({
        url: this.url() + '/match',
        type: 'POST',
        data: data,
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( match ) {
          if( done ) {
            done.call( scope || this, match );
          }
        }
      });
    },
    
    // Retrieve a positions table for the teams in the tournament
    // @param  function  Callback to execute when request is done
    // @param  scope     Scope to use on the callback, defaults to the model instance
    getStatistics: function( done, scope ) {
      debug( 'retrieving tournament statistics' );
      this._sendRequest({
        url: this.url() + '/statistics',
        type: 'GET',
        error: function( req ) {
          this._notifyError( req.responseJSON );
          if( done ) {
            done.call( scope || this, false );
          }
        },
        success: function( table ) {
          if( done ) {
            done.call( scope || this, table );
          }
        }
      });
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return Model definition as module export
  module.exports = TournamentModel;
});

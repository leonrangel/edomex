define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:register:views:profile' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // View definition
  var RegisterProfileView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/profile.hbs' ) ),
    
    behaviors: {
      'tooltip': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form': 'form',
      'url': 'input[name="url"]',
      'avatar': 'input[name="avatar"]',
      'avatarDisplay': 'label.upload-avatar-button'
    },
    
    events: {
      'change @ui.avatar' : 'avatarUpload',
      'blur @ui.url' : 'validateURL'
    },
    
    submit: function() {
      debug( 'processing form' );
      
      // Get birthday string
      var date = this.$( 'select[name="birth[day]"]' ).val();
      date += '-' + this.$( 'select[name="birth[month]"]' ).val();
      date += '-' + this.$( 'select[name="birth[year]"]' ).val();
      
      // Get new user info
      var data = {
        url  : this.$( 'input[name="url"]' ).val(),
        mobile: this.$('#mobile').val(),
        info : {
          gender    : this.$( 'select[name="info[gender]"]' ).val(),
          stature   : this.$( 'input[name="info[stature]"]' ).val(),
          position  : this.$( 'select[name="info[position]"]' ).val(),
          country   : this.$( 'select[name="info[country]"]' ).val(),
          profile   : this.$( 'select[name="info[profile]"]' ).val(),
          weigth    : this.$( 'input[name="info[weigth]"]' ).val(),
          number    : this.$( 'input[name="info[number]"]' ).val(),
          nickname  : this.$( 'input[name="info[nickname]"]' ).val(),
          birthday  : new Date( date )
        },
        extras: {
          filled: true
        }
      }
      
      this.model.save( data, {
        patch: true,
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },

        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }        
      });
      
      // Exit and reload
      window.location.hash = '#';
    },
    
    avatarUpload: function() {
      debug( 'uploading new avatar' );
      
      var data = new FormData( this.ui.form[0] );
      this.model.uploadAvatar( data, function( ok ) {
        if( ok ) {
          // Display uploaded avatar
          this.ui.avatarDisplay
            .addClass( 'filled' )
            .css( 'background-image', "url("+ this.model.get( 'avatar' ) +")" );
        }
      }, this );
    },
    
    validateURL: function() {
      debug( 'check if url is available' );
      
      // If field is empty stop there
      if( this.ui.url.val() === '' )
        return;
      
      // Get safe version of the url value
      var test = this.ui.url.val()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
      
      // Update field and check availability
      this.ui.url.val( test );
      this.model.isAvailable( { url: test }, function( available ) {
        this.ui.url
          .removeClass( 'validator-error' )
          .removeAttr( 'data-validator-error' );
          
        if( ! available ) {
          this.ui.url
            .addClass( 'validator-error' )
            .attr( 'data-validator-error', 'URL no disponible' );
        }
      }, this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = RegisterProfileView;
});

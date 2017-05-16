define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:player:views:header' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var PlayerHeader = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/header.hbs' ) ),

    behaviors: {
      tooltip: {}
    },

    ui: {
      'form'           : 'form',
      'avatarChooser'  : 'input[name="avatar"]',
      'frontChooser'   : 'input[name="front"]',
      'avatar'         : 'div.avatar',
      'front'          : 'div.extract',
      'name'           : 'div.title h1',
      'url'            : 'div.title h5 span'
    },

    events: {
      'change @ui.avatarChooser' : 'uploadAvatar',
      'change @ui.frontChooser'  : 'uploadFront',
      'blur @ui.url'  : 'validateURL'
    },

    initialize: function( options ) {
      debug( 'initializing with options: %o', options );
      this.player  = options.player;
      this.user    = options.user;
      this.isOwner = options.isOwner;
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.player.toJSON() ) );
      this.bindUIElements();
      return this;
    },

    saveChanges: function() {
      debug( 'save changes to the user details' );

      // Don't do anything if url is not available
      if( this.ui.url.hasClass( 'validator-error' ) ) {
        return false;
      }

      // Set values and patch if required
      this.user.set({
        url: this.ui.url.text(),
        name: this.ui.name.text()
      });
      if( this.user.changedAttributes() ) {
        this.user.patch();
        return true;
      }
    },

    validateURL: function() {
      debug( 'validate if URL is available' );

      if ( this.ui.url.text().trim() === '' ) {
        this.ui.url
          .addClass( 'validator-error' )
          .attr( 'title', 'URL no válida' );
        return;
      }

      // Get safe version of the url value
      var test = this.ui.url.text()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
      this.ui.url.text( test );

      // Check availability
      var data = { id: this.user.id, url: test };
      this.user.isAvailable( data, function( available ) {
        this.ui.url
          .removeClass( 'validator-error' )
          .attr( 'title', 'Click para editar' )

        if( ! available ) {
          this.ui.url
            .addClass( 'validator-error' )
            .attr( 'title', 'URL no disponible' );
        }
      }, this );
    },

    uploadAvatar: function() {
      debug( 'upload new avatar' );

      var data = new FormData( this.ui.form[0] );
      this.user.uploadAvatar( data, function( ok ) {
        if( ok ) {
          var url  = 'url( "https://www.somosfut.com/user/' + this.user.get( '_id' ) + '/avatar" )';
          this.ui.avatar.css( 'background-image', url );
          $('.user-avatar').css( 'background-image', url );
        }
      }, this );
    },

    uploadFront: function() {
      debug( 'upload new front' );

      var data = new FormData( this.ui.form[0] );
      this.user.uploadFront( data, function( ok ) {
        if( ok ) {
          var url  = 'url( "https://www.somosfut.com/user/' + this.user.get( '_id' ) + '/front" )';
          this.ui.front.css( 'background-image', url );
        }
      }, this );
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      // Hide admin elements
      // FIX this should be done by CSS
      this.ui.avatarChooser.hide();
      this.ui.frontChooser.hide();

      // Enable admin functionality
      if( this.user && this.isOwner ) {

        // Make name and url editable
        this.ui.url
          .attr( 'contenteditable', true )
          .attr( 'title', 'Click para editar' )
          .addClass( 'hasTip' );

        // Enable avatar and front image uploaders
        this.ui.avatarChooser.show();
        this.ui.frontChooser.show();
      }
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = PlayerHeader;
});
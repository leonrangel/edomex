define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:header' );

  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );

  // View definition
  var TeamHeader = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/header.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'form'           : 'form',
      'frontChooser'   : 'input[name="front"]',
      'avatarChooser'  : 'input[name="avatar"]',
      'frontImage'     : 'div.extract',
      'avatar'         : 'div.avatar',
      'name'           : 'div.title h1',
      'url'            : 'div.title h5 span',
      'nav'            : 'div.nav a',
      'saveChanges'    : 'button#saveChanges',
      'joinTournament' : 'li#joinTournament'
    },
    
    events: {
      'click @ui.nav' : 'loadSection',
      'blur @ui.url'  : 'validateURL',
      'click @ui.saveChanges'    : 'saveChanges',
      'change @ui.frontChooser'  : 'uploadFront',
      'change @ui.avatarChooser' : 'uploadAvatar'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      this.team = options.team;
      this.isAdmin = options.isAdmin;
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.team.toJSON() ) );
      this.bindUIElements();
      return this;
    },
    
    uploadAvatar: function() {
      debug( 'upload new avatar' );
      
      var data = new FormData( this.ui.form[0] );
      var url  = 'url( "https://www.somosfut.com/team/' + this.team.id + '/avatar" );';
      this.team.uploadAvatar( data, function( ok ) {
        if( ok ) {
          this.ui.avatar.css( 'background-image', url );
        }
      }, this );
    },
    
    uploadFront: function() {
      debug( 'upload new front image' );
      
      var data = new FormData( this.ui.form[0] );
      var url  = 'url( "https://www.somosfut.com/team/' + this.team.id + '/front" )';
      this.team.uploadFrontImage( data, function( ok ) {
        if( ok ) {
          this.ui.frontImage.css( 'background-image', url );
        }
      }, this );
    },
    
    loadSection: function( e ) {
      e.preventDefault();
      var target = $( e.currentTarget );
      var li = target.parent();
      
      // Ignore already active and disabled elements
      if( ! li.hasClass( 'active' ) && ! li.hasClass( 'disabled' ) ) {
        var prevSection = li.parent().find('li.active > a');
        // Mark as active
        this.ui.nav.parent().removeClass( 'active' );
        li.addClass( 'active' );
        
        // Trigger event
        this.trigger( 'show:area', target.attr( 'href' ), prevSection.attr( 'href' ) );
      }
    },
    
    validateURL: function() {
      debug( 'validate if URL is available' );
      
      // Get safe version of the url value
      var test = this.ui.url.text()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
      this.ui.url.text( test );
        
      // Check availability
      var data = { id: this.team.id, url: test };
      this.team.isAvailable( data, function( available ) {
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
    
    saveChanges: function( e ) {
      debug( 'save changes to the team details' );
      e.preventDefault();
      
      // Don't do anything if url is not available
      if( this.ui.url.hasClass( 'validator-error' ) ) {
        return;
      }
      
      // Set values and patch if required
      this.team.set({
        name : this.ui.name.text(),
        url  : this.ui.url.text()
      });
      if( this.team.changedAttributes() ) {
        this.team.patch();
      }
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      // Hide admin elements
      // FIX this should be done by CSS
      this.ui.saveChanges.hide();
      this.ui.frontChooser.hide();
      this.ui.avatarChooser.hide();
      
      // Enable admin functionality
      if( this.isAdmin ) {
        // Enable jointournament link
        this.ui.joinTournament
          .removeClass( 'hasTip disabled' )
          .removeAttr( 'title' );
        
        // Make name and url editable
        this.ui.name
          .attr( 'contenteditable', true )
          .attr( 'title', 'Click para editar' )
          .addClass( 'hasTip' );
        this.ui.url
          .attr( 'contenteditable', true )
          .attr( 'title', 'Click para editar' )
          .addClass( 'hasTip' );
        
        // Enable avatar and front image uploaders
        this.ui.frontChooser.show();
        this.ui.avatarChooser.show();
        
        // Display saveChanges button
        this.ui.saveChanges.show();
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
  module.exports = TeamHeader;
});

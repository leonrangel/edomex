define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:sidebar' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentSidebar = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/sidebar.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'toggle'  : 'a.nav-active',
      'menu'    : 'ul.sidebar-list',
      'nav'     : 'ul.sidebar-list a',
      'details' : 'ul.sidebar-list a[href="details"]' 
    },
    
    events: {
      'click @ui.nav'    : 'loadSection',
      'click @ui.toggle' : 'toggleMenu'
    },
    
    render: function() {
      debug( 'rendered' );
      this.setElement( this.template( this.options ) );
      this.bindUIElements();
      return this;
    },
    
    loadSection: function( e ) {
      debug( 'loading new content section' );
      e.preventDefault();
      var target = $( e.currentTarget );
      
      // Ignore already active and disabled elements
      if( ! target.hasClass( 'active' ) && ! target.hasClass( 'disabled' ) ) {
        // Mark as active
        this.ui.nav.removeClass( 'active' );
        target.addClass( 'active' );
        
        // Trigger event
        this.trigger( 'show:area', target.attr( 'href' ) );
      }
    },
    
    toggleMenu: function( e ) {
      debug( 'toggle menu' );
      e.preventDefault();
      this.ui.menu.toggleClass( 'sidebar-mobile' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = TournamentSidebar;
});
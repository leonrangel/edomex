define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:editSidebar' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var LeagueEditSidebar = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/sidebar.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'navlist' : 'ul.sidebar-list',
      'nav'     : 'ul.sidebar-list a'
    },
    
    events: {
      'click @ui.nav' : 'loadSection',
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    loadSection: function( e ) {
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
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
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
  module.exports = LeagueEditSidebar;
});
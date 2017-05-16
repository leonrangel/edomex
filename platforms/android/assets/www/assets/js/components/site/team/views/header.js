define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:team:views:header' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TeamHeader = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/header.hbs' ) ),
    
    ui: {
      'nav' : 'div.nav a',
    },
    
    events: {
      'click @ui.nav' : 'loadSection',
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.options.team.toJSON() ) );
      this.bindUIElements();
      return this;
    },
    
    loadSection: function( e ) {
      e.preventDefault();
      var target = this.$( e.currentTarget );
      var li = target.parent();
      
      // Ignore already active and disabled elements
      if( ! li.hasClass( 'active' ) && ! li.hasClass( 'disabled' ) ) {
        // Mark as active
        this.ui.nav.parent().removeClass( 'active' );
        li.addClass( 'active' );
        
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
  module.exports = TeamHeader;
});
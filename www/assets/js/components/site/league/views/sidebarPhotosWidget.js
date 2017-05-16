define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:sidebarPhotosWidget' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var SidebarPhotosCell  = require( './sidebarPhotosCell' );
  
  // View definition
  var SidebarPhotosWidget = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/sidebarPhotos.hbs' ) ),
    childView: SidebarPhotosCell,
    childViewContainer: 'div.recent-photos-thumbs ul',
    
    ui: {
      'more' : 'a.load-more-links'
    },
    
    events: {
      'click @ui.more' : 'showMore'
    },
    
    showMore: function( e ) {
      e.preventDefault();
      this.trigger( 'more' );
    },
    
    onRender: function() {
      debug( 'rendered' );
      this.bindUIElements();
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
  module.exports = SidebarPhotosWidget;
});
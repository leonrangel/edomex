define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:sidebarPhotosCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var SidebarPhotosCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/sidebarPhotosCell.hbs' ) ),
    tagName: 'li',
    
    behaviors: {
      tooltip: {}
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
  
  // View definition as module export
  module.exports = SidebarPhotosCell;
});
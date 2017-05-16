define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:galleryCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var GalleryCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/galleryCell.hbs' ) ),
    tagName: 'li',
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'delete' : 'span.delete'
    },
    
    triggers: {
      'click @ui.delete' : 'delete'
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
  module.exports = GalleryCell;
});
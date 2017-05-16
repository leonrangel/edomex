define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:gallery' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var GalleryCell  = require( './galleryCell' );
  
  // View definition
  var LeagueGallery = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/gallery.hbs' ) ),
    childView: GalleryCell,
    childViewContainer: 'div.photos ul',
    
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
  module.exports = LeagueGallery;
});
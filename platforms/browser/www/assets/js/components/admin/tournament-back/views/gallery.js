define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:gallery' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var GalleryCell  = require( './galleryCell' );
  var NewImageForm = require( './newImage' );
  var utils        = require( 'helpers/utils' );
  
  // View definition
  var TournamentGallery = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/gallery.hbs' ) ),
    childView: GalleryCell,
    childViewContainer: 'div.photos ul',
    childEvents: {
      'delete' : 'deleteImage'
    },
    
    ui: {
      'createBtn' : 'button.create'
    },
    
    events: {
      'click @ui.createBtn' : 'newImage'
    },
    
    newImage: function() {
      debug( 'display new image modal form' );
      var form = new NewImageForm();
      form.on( 'submit', function( data) {
        data.append( 'tournament', this.options.item.id );
        
        debug( 'store new image' );
        this.options.item.addImage( data, function( img ) {
          this.options.collection.add( img );
        }, this );
      }, this );
      
      this.trigger( 'show:modal', form );
    },
    
    deleteImage: function( cell ) {
      debug( 'delete selected image' );
      cell.model.destroy({
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }
      });
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
  module.exports = TournamentGallery;
});

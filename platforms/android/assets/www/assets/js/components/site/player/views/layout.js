define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:player:views:layout' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // Child views
  var PlayerHeader          = require( './header' );
  var PlayerInformation     = require( './information' );
  var PlayerEditInformation = require( './editInformation' );
  
  // Layout definition
  var PlayerLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'modalRegion'   : '#playerModal',
      'headerRegion'  : '#playerHeader',
      'contentRegion' : '#playerContent'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      this.header = new PlayerHeader({
        player  : options.player,
        user    : options.user,
        isOwner : options.isOwner
      });
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.headerRegion.show( this.header );

      if ( this.options.user && this.options.isOwner ) {
        this.contentRegion.show( new PlayerEditInformation({
          player : this.options.player,
          user   : this.options.user,
          header : this.header
        }) );
      } else {
        this.contentRegion.show( new PlayerInformation({
          player : this.options.player
        }) );
      }
    },
    
    onShow: function() {
      debug( 'displayed' );
      $( 'body' ).removeClass().addClass( 'app' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = PlayerLayout;
});
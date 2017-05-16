define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:sidebarNewsWidget' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var SidebarNewsCell  = require( './sidebarNewsCell' );
  

  var $  = require( 'jquery' ); // -M
  // View definition
  var SidebarNewsWidget = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/sidebarNews.hbs' ) ),
    childView: SidebarNewsCell,
    childViewContainer: 'div.links-list ul',
    
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

      $('a', this.$el).click(function(e){
        e.preventDefault();
        $('#leagueHeader a[href="noticias"]').click();
      });
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
  module.exports = SidebarNewsWidget;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:news' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var NewsCell  = require( './newsCell' );
  
  // View definition
  var LeagueNews = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/news.hbs' ) ),
    childView: NewsCell,
    childViewContainer: 'div.content-list ul',
    
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
  module.exports = LeagueNews;
});
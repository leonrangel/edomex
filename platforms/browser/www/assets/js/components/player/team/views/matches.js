define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:matches' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var MatchCell = require( './matchCell' );
  
  // View definition
  var TeamMatches = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/matches.hbs' ) ),
    childView: MatchCell,
    childViewContainer: 'div.matches-list',
    
    ui: {
      'filters': 'ul.sidebar-list a'
    },
    
    events: {
      'click @ui.filters' : 'applyFilter'
    },

    applyFilter: function( e ) {
      // Get filter value and current date
      e.preventDefault();
      var el = this.$( e.currentTarget );
      var filter = el.attr( 'href' );

      this.collection.fetch({ async: false });
      // Apply filter
      this.ui.filters.removeClass( 'active' );
      this[filter + 'Filter']();
    },

    nextFilter: function() {
      debug( 'show future matches' );
      this.ui.filters.filter( '[href="next"]' ).addClass( 'active' );
      this.filterVal = 'next';
      this.collection.applyFilter( function( match ) {
        var res  = false;
        var now = new Date();
        var date = new Date( match.get( 'date' ) );
        if( date >= now ) {
          res = true;
        }
        return res;
      });
    },

    previousFilter: function() {
      debug( 'show past matches' );
      this.ui.filters.filter( '[href="previous"]' ).addClass( 'active' );
      this.collection.applyFilter( function( match ) {
        var res  = false;
        var now = new Date();
        var date = new Date( match.get( 'date' ) );
        if( date < now ) {
          res = true;
        }
        return res;
      });
    },

    allFilter: function() {
      debug( 'show all matches' );
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
  module.exports = TeamMatches;
});

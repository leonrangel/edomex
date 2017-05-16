define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:tournaments' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TeamTournaments = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/tournaments.hbs' ) ),
    tableTpl: Valkie.template( require( 'text!./templates/tournamentStats.hbs' ) ),
    
    ui: {
      'filters': 'ul.sidebar-list a',
      'table'  : 'div.primary-table-wrapper'
    },
    
    events: {
      'click @ui.filters' : 'applyFilter'
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.options ) );
      this.bindUIElements();
      return this;
    },
    
    applyFilter: function( e ) {
      e.preventDefault();
      var el = this.$( e.currentTarget );
      if( ! el.hasClass( 'active' ) ) {
        this.loadItem( el.attr( 'href' ) );
      }
    },
    
    loadItem: function( index ) {
      debug( 'showing entry: %d', index );
      this.ui.filters.removeClass( 'active' );
      this.$( this.ui.filters[ index ] ).addClass( 'active' );
      this.ui.table.html( this.tableTpl( this.options.data[ index ].stats ) );
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
    },
    
    onShow: function() {
      debug( 'displayed' );
      this.loadItem( 0 );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // View definition as module export
  module.exports = TeamTournaments;
});
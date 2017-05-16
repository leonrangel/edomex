define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:info:views:intro' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var IntroView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/intro.hbs' ) ),
    
    initialize: function() {
      debug( 'initializing' );
    },
    
    loadSection: function( section ) {
      debug( 'displaying content for section: %s', section );
      var tpl = false;
      switch ( section ) {
        case 'principal':
          tpl = Valkie.template( require( 'text!./templates/introHome.hbs' ) );
          break;
        case 'players':
          tpl = Valkie.template( require( 'text!./templates/introPlayers.hbs' ) );
          break;
        case 'teams':
          tpl = Valkie.template( require( 'text!./templates/introTeams.hbs' ) );
          break;
        case 'leagues':
          tpl = Valkie.template( require( 'text!./templates/introLeagues.hbs' ) );
          break;
        case 'contact':
          tpl = Valkie.template( require( 'text!./templates/introContact.hbs' ) );
          break;
        case 'privacy':
          tpl = Valkie.template('');
          break;
        default:
          tpl = Valkie.template( require( 'text!./templates/introHome.hbs' ) );
          break;
      }
      this.$el.html( tpl() );
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
  module.exports = IntroView;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:info:views:features' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var FeaturesView = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/intro.hbs' ) ),
    
    initialize: function() {
      debug( 'initializing' );
    },
    
    loadSection: function( section ) {
      debug( 'displaying content for section: %s', section );
      var tpl = false;
      switch ( section ) {
        case 'principal':
          tpl = Valkie.template( require( 'text!./templates/featuresHome.hbs' ) );
          break;
        case 'players':
          tpl = Valkie.template( require( 'text!./templates/featuresPlayers.hbs' ) );
          break;
        case 'teams':
          tpl = Valkie.template( require( 'text!./templates/featuresTeams.hbs' ) );
          break;
        case 'leagues':
          tpl = Valkie.template( require( 'text!./templates/featuresLeagues.hbs' ) );
          break;
        case 'contact':
          tpl = Valkie.template( require( 'text!./templates/featuresContact.hbs' ) );
          break;
        case 'privacy':
          tpl = Valkie.template(require('text!./templates/privacy.hbs'));
          break;
        default:
          tpl = Valkie.template( require( 'text!./templates/featuresHome.hbs' ) );
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
  module.exports = FeaturesView;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:info:views:layout' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // Child views
  var HeaderView    = require( './header' );
  var IntroView     = require( './intro' );
  var FeaturesView  = require( './features' );
  var SubscribeView = require( './subscribe' );
  
  // Layout definition
  var ContentLaytout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'introRegion'     : '#page-intro',
      'featuresRegion'  : '#page-home',
      'subscribeRegion' : '#subscribe'
    },
    
    ui: {
      'intro'     : '#page-intro',
      'features'  : '#page-home',
      'subscribe' : '#subscribe'
    },
    
    initialize: function() {
      debug( 'initializing' );
      this.hasSection    = false;
      this.intro         = new IntroView();
      this.features      = new FeaturesView();
      this.subscribeForm = new SubscribeView();
      this.header        = new HeaderView();
      this.header.on( 'show:section', this.section, this );
    },
    
    section: function( section ) {
      debug( 'displaying content for section: %s', section );
      
      // Mark active header item
      this.header.markActive( section );
      
      // FIX
      // This mess can be avoided by using consistent classes on CSS =/
      if( section === '' ) {
        section = 'principal';
        this.ui.features.removeClass().addClass( 'home-features' );
      } else {
        this.ui.features.removeClass().addClass( 'profile-features' );
      }

      if (section === 'privacy') {
        this.ui.features.removeClass().addClass('page-content'); 
      }
      
      this.ui.intro.removeClass().addClass( 'intro-page ' + section );
      
      // Update child views accordingly
      this.hasSection = true;
      this.intro.loadSection( section );
      this.features.loadSection( section );
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.introRegion.show( this.intro );
      this.featuresRegion.show( this.features );
      this.subscribeRegion.show( this.subscribeForm );
    },
    
    onShow: function() {
      debug( 'displayed' );
      $( 'body' ).removeClass();
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = ContentLaytout;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:editLayout' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Child views
  var EditSidebar       = require( './editSidebar' );
  var LeagueInformation = require( './information' );
  var LeagueContact     = require( './contact' );
  var LeagueExtras      = require( './extraInfo' );
  var LeagueAdditionals = require( './additionals' );
  var ConfirmNavigation = require( './confirm' );
  
  // Layout definition
  var LeagueEditLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    data: {},
    
    regions: {
      'modalRegion'   : '#leagueModal',
      'sidebarRegion' : '#leagueSidebar',
      'contentRegion' : '#leagueContent'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      
      // Set data
      this.data.league = options.league;
      
      // Initialize child views, it will be displayed 'onBeforeShow'
      this.sidebar = new EditSidebar();
      this.sidebar.on( 'show:area', this.loadSection, this );
    },
    
    loadSection: function( section ) {
      debug( 'load content subview for section: %s', section );
      if( !this.validateUnsavedData( section ) ) { return; }

      switch( section ) {
        case 'info':
          var info = new LeagueInformation({
            league: this.data.league
          });
          info.on( 'data:changed', this.onChangedData, this );

          this.contentRegion.show( info );
          break;
        case 'contact':
          var contact = new LeagueContact({
            league: this.data.league
          });
          contact.on( 'data:changed', this.onChangedData, this );

          this.contentRegion.show( contact );
          break;
        case 'rules':
          var rules = new LeagueExtras({
            league: this.data.league
          });
          rules.on( 'data:changed', this.onChangedData, this );

          this.contentRegion.show( rules );
          break;
        case 'extras':
          var extras = new LeagueAdditionals({
            league: this.data.league
          });
          extras.on( 'data:changed', this.onChangedData, this );

          this.contentRegion.show( extras );
          break;
      }
    },

    validateUnsavedData: function ( navSection ) {
      if( this.unsavedData ) {
        this.unsavedData.navSection = navSection;

        this.sidebar.ui.nav.removeClass( 'active' );
        var section = this.unsavedData.view.$el.attr( 'section' );
        var navItem = this.sidebar.ui.navlist.find( 'a[href="' + section + '"]' );
        navItem.addClass( 'active' );

        // Confirm navigation modal
        var confirm = new ConfirmNavigation();
        confirm.on( 'cancel', this.continueUnsaved, this );
        confirm.on( 'confirm', this.submitUnsaved, this );
        this.showModal( confirm );

        return false;
      }

      return true;
    },

    submitUnsaved: function( modal ) {
      if( this.unsavedData ) {
        debug( 'save unsaved' );

        modal.$el.modal( 'hide' );

        var navSection = this.unsavedData.navSection;
        this.unsavedData.view.submit();
        this.unsavedData = undefined;

        // Continue navigation
        var navItem = this.sidebar.ui.navlist.find( 'a[href="' + navSection + '"]' );
        navItem.click();
      }
    },

    continueUnsaved: function( modal ) {
      debug( 'continue unsaved' );

      modal.$el.modal( 'hide' );

      var navSection = this.unsavedData.navSection;
      this.unsavedData = undefined;

      // Continue navigation
      var navItem = this.sidebar.ui.navlist.find( 'a[href="' + navSection + '"]' );
      navItem.click();
    },

    showModal: function( view ) {
      this.modalRegion.show( view );
    },

    onChangedData: function( view ) {
      this.unsavedData = view;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.sidebarRegion.show( this.sidebar );
    },
    
    onShow: function() {
      debug( 'displayed' );
      this.loadSection( 'info' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = LeagueEditLayout;
});
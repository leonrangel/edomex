define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:team:views:layout' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // Child views
  var TeamHeader      = require( './header' );
  var TeamMatches     = require( './matches' );
  var TeamMembers     = require( './members' );
  var TeamTournaments = require( './tournaments' );
  var TeamInformation = require( './information' );
  
  // Data
  var UsersCollection   = require( 'models/users' );
  var MatchesCollection = require( 'models/matches' );
  
  // Layout definition
  var TeamLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'modalRegion'   : '#teamModal',
      'headerRegion'  : '#teamHeader',
      'contentRegion' : '#teamContent'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      
      // Initialize required data
      this.data = {
        team: options.team,
        members: new UsersCollection(),
        matches: new MatchesCollection()
      };
      this.data.members.url = 'https://www.somosfut.com/team/' + options.team.id + '/members';
      this.data.matches.url = 'https://www.somosfut.com/team/' + options.team.id + '/matches';
      
      // Initialize child views, it will be displayed 'onBeforeShow'
      this.header = new TeamHeader({ team : this.data.team });
      this.header.on( 'show:area', this.loadSection, this );
    },
    
    loadSection: function( section ) {
      debug( 'load content subview for section: %s', section );
      
      // Prepare content based on section
      var content = null;
      switch( section ) {
        case 'partidos':
          this.data.matches.fetch({ async: false });
          content = new TeamMatches({
            collection: this.data.matches
          });
          break;
        case 'estadisticas':
          this.data.team.getTournaments( function( data ) {
            if( data ) {
              content = new TeamTournaments({ data: data });
              this.contentRegion.show( content );
            }
          }, this );
          break;
        case 'miembros':
          this.data.members.fetch();
          content = new TeamMembers({
            collection: this.data.members
          });
          break;
        case 'info':
          content = new TeamInformation({
            team: this.data.team
          });
          break;
      }
      
      // Load content if any
      if( content ) {
        this.contentRegion.show( content );
      }
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.headerRegion.show( this.header );
    },
    
    onShow: function() {
      debug( 'displayed' );
      $( 'body' ).removeClass().addClass( 'app' );
      this.loadSection( 'partidos' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = TeamLayout;
});
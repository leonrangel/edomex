define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:layout' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // Child views
  var LeagueHeader      = require( './header' );
  var LeagueHome        = require( './home' );
  var LeagueDetails     = require( './details' );
  var LeagueNews        = require( './news' );
  var LeagueGallery     = require( './gallery' );
  var LeagueInformation = require( './information' );
  
  // Lighbox general view
  var Lightbox = require( 'components/site/views/lightbox' );
  
  // Data
  var PostsCollection       = require( 'models/posts' );
  var MatchesCollection     = require( 'models/matches' );
  var TournamentsCollection = require( 'models/tournaments' );
  
  // Layout definition
  var LeagueLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    events: {
      'click a.lightbox' : 'lightbox'
    },
    
    regions: {
      'modalRegion'   : '#leagueModal',
      'headerRegion'  : '#leagueHeader',
      'contentRegion' : '#leagueContent'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      
      // Initialize required data
      this.data = {
        league  : options.league,
        news    : new PostsCollection(),
        photos  : new PostsCollection(),
        matches : new MatchesCollection(),
        tournaments: new TournamentsCollection()
      };
      this.data.news.url   = 'https://www.somosfut.com/league/' + options.league.id + '/news';
      this.data.photos.url = 'https://www.somosfut.com/league/' + options.league.id + '/gallery';
      this.data.matches.url = 'https://www.somosfut.com/league/' + options.league.id + '/matches';
      this.data.tournaments.url = 'https://www.somosfut.com/league/' + options.league.id + '/tournaments';
      
      // Initialize child views, it will be displayed 'onBeforeShow'
      this.header = new LeagueHeader({ league : this.data.league });
      this.header.on( 'show:area', this.loadSection, this );
    },
    
    loadSection: function( section ) {
      debug( 'load content subview for section: %s', section );
      
      // Prepare content based on section
      var content = null;
      switch( section ) {
        case 'inicio':
          this.data.news.fetch();
          this.data.photos.fetch();
          this.data.matches.fetch({ async: false });
          this.data.tournaments.fetch();
          var home = new LeagueHome({
            data: this.data
          });
          home.on({
            'more:news': function() {
              this.loadSection( 'noticias' );
              this.header.markActive( 'noticias' );
            },
            'more:photos': function() {
              this.loadSection( 'galeria' );
              this.header.markActive( 'galeria' );
            }
          }, this );
          content = home;
          break;
        case 'noticias':
          this.data.news.fetch({ async: false });
          content = new LeagueNews({
            collection: this.data.news
          });
          break;
        case 'galeria':
          this.data.photos.fetch({ async: false });
          content = new LeagueGallery({
            collection: this.data.photos
          });
          break;
        case 'reglamento':
          content = new LeagueInformation({
            league: this.data.league
          });
          break;
        case 'info':
          content = new LeagueDetails({
            league: this.data.league
          });
          break;
      }
      
      // Load content if any
      if( content ) {
        this.contentRegion.show( content );
      }
    },
    
    lightbox: function( e ) {
      e.preventDefault();
      var img = $( e.currentTarget ).css( 'background-image' );
      var lightbox = new Lightbox({ url: img });
      this.modalRegion.show( lightbox );
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.headerRegion.show( this.header );
    },
    
    onShow: function() {
      debug( 'displayed' );
      $( 'body' ).removeClass().addClass( 'app' );
      this.loadSection( 'inicio' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = LeagueLayout;
});
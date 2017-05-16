define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:home' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Child views
  var LeagueMatches        = require( './matches' );
  var LeagueTournaments    = require( './tournaments' );
  var TournamentStatistics = require( './tournamentStats' );
  var SidebarNewsWidget    = require( './sidebarNewsWidget' );
  var SidebarPhotosWidget  = require( './sidebarPhotosWidget' );

  var TournamentFinals  = require( './finals' );
  var FinalsCollection   = require( 'models/finals' );
  
  



  
  // View definition
  var LeagueHome = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/home.hbs' ) ),
    
    regions: {
      'tournamentsBanner' : '#leagueTournamentsStripe',
      'matchesList'       : '#leagueMatchesList',
      'finalsList'       : '#leagueFinalsList'
    },
    
    ui: {
      'sidebar' : '#leagueSidebar',
      'contentTitle' : '#contentBlockTitle'
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      
      

      var tournamentsView = new LeagueTournaments({
        collection: this.options.data.tournaments
      });
      tournamentsView.on( 'details', function( sel ) {
        sel.getStatistics( function( stats ) {
          this.ui.contentTitle.text( '' + sel.get( 'name' ) );
          this.matchesList.show( new TournamentStatistics({ stats: stats, tournament : sel }) );
          //console.log('this',sel.toJSON());
          var contentLiguilla     = new FinalsCollection();
          contentLiguilla.url = 'https://somosfut.com/tournament/' + sel.get('_id')  + '/finals';
          contentLiguilla.fetch({ async: false });
          this.finalsList.show( new TournamentFinals({
            item: sel,
            collection: contentLiguilla
          }) );

        }, this );
      }, this );
      this.tournamentsBanner.show( tournamentsView );
      
      this.matchesList.show( new LeagueMatches({
        collection: this.options.data.matches
      }) );

      // check liguilla
      
      

      

    },
    
    onShow: function() {
      debug( 'displayed' );
      
      // Add sidebar widgets
      var newsWidget   = new SidebarNewsWidget({ collection: this.options.data.news });
      var photosWidget = new SidebarPhotosWidget({ collection: this.options.data.photos });
      this.ui.sidebar.append( newsWidget.render().el );
      this.ui.sidebar.append( photosWidget.render().el );
      
      newsWidget.on( 'more', function() { this.trigger( 'more:news' ) }, this );
      photosWidget.on( 'more', function() { this.trigger( 'more:photos' ) }, this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LeagueHome;
});
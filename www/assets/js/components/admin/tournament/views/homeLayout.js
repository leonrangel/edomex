define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:homeLayout' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // Child views
  var TournamentSidebar   = require( './sidebar' );
  var TournamentDetails   = require( './details' );
  var TournamentCalendar  = require( './calendar' );
  var TournamentFinals  = require( './finals' );
  var TournamentFriendly  = require( './friendly' );
  var TournamentTeams     = require( './teams' );
  var TournamentPlayers   = require( './players' );
  var TournamentStats     = require( './statistics' );
  var TournamentReferee   = require( './referee' );
  var TournamentNews      = require( './news' );
  var TournamentGallery   = require( './gallery' );

  // Data
  var TeamsCollection     = require( 'models/users' ); // -M
  var UsersCollection     = require( 'models/users' );
  var PostsCollections    = require( 'models/posts' );
  var MatchesCollection   = require( 'models/matches' );
  var FinalsCollection   = require( 'models/finals' );
  var FriendlyCollection   = require( 'models/friendlys' );

  // Layout definition
  var TournamentHomeLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/homeLayout.hbs' ) ),

    data: {},

    regions: {
      'modalRegion'   : '#tournamentModal',
      'sidebarRegion' : '#tournamentSidebar',
      'contentRegion' : '#tournamentContent'
    },

    initialize: function( options ) {
      debug( 'initializing' );

      // Set data https://somosfut.com
      this.data.tournament  = options.tournament;
      this.data.matches     = new MatchesCollection();
      this.data.matches.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/matches';
      this.data.finals     = new FinalsCollection();
      this.data.finals.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/finals';
      this.data.friendly     = new FriendlyCollection();
      this.data.friendly.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/friendly';
      this.data.players     = new UsersCollection();
      this.data.players.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/players';
      this.data.teams     = new TeamsCollection(); // -M
      this.data.teams.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/teams';
      this.data.posts       = new PostsCollections();
      this.data.posts.url   = 'https://somosfut.com/tournament/' + options.tournament.id  + '/posts';
      this.data.gallery     = new PostsCollections();
      this.data.gallery.url = 'https://somosfut.com/tournament/' + options.tournament.id  + '/gallery';

      // Initialize child views, it will be displayed 'onBeforeShow'
      this.sidebar = new TournamentSidebar({
        id: this.data.tournament.id,
        name: this.data.tournament.get( 'name' )
      });
      this.sidebar.on( 'show:area', this.loadSection, this );
    },

    loadSection: function( section ) {
      debug( 'load content subview for section: %s', section );
      switch( section ) {
        case 'details':
          this.contentRegion.show( new TournamentDetails({
            item: this.data.tournament
          }) );
          break;
        case 'teams':
          this.data.teams.fetch({ async: false }); // -M
          var team = new TournamentTeams({
            item: this.data.teams,
            tournament: this.data.tournament
          });
          team.on({
            'show:modal' : this.showModal,
            'reset' : function(){ 
              this.data.tournament.fetch({ async: false });
              this.loadSection( 'teams' );
            }
          }, this); 
          
          this.contentRegion.show( team );
          break;
        case 'calendar':
          this.data.matches.fetch({ async: false });

          var calendar = new TournamentCalendar({
            item: this.data.tournament,
            collection: this.data.matches
          });
          calendar.on({
            'show:modal': this.showModal,
            'show:subview': function( view ) {
              this.contentRegion.show( view );
            },
            'reset': function() {
              this.loadSection( 'calendar' );
            }
          }, this );
          this.contentRegion.show( calendar );
          break;

        case 'finals':
          this.data.finals.fetch({ async: false });
          this.data.tournament.fetch({ async: false });

          var calendar = new TournamentFinals({
            item: this.data.tournament,
            collection: this.data.finals
          });
          calendar.on({
            'show:modal': this.showModal,
            'show:subview': function( view ) {
              this.contentRegion.show( view );
            },
            'reset': function() {
              this.loadSection( 'finals' );
            }
          }, this );
          this.contentRegion.show( calendar );
          break;


        case 'friendly':
          this.data.friendly.fetch({ async: false });
          this.data.tournament.fetch({ async: false });

          var calendar = new TournamentFriendly({
            item: this.data.tournament,
            collection: this.data.friendly
          });
          calendar.on({
            'show:modal': this.showModal,
            'show:subview': function( view ) {
              this.contentRegion.show( view );
            },
            'reset': function() {
              this.loadSection( 'friendly' );
            }
          }, this );
          this.contentRegion.show( calendar );
          break;


        case 'stats':
          this.data.tournament.getStatistics( function( data ) {
            if( data ) {
              this.contentRegion.show( new TournamentStats({ data: data, tournament: this.data.tournament }) );
            }
          }, this );
          break;
        case 'players':
          this.data.players.fetch({ async: false });
          var players = new TournamentPlayers({
            players: this.data.players,
            tournament : this.data.tournament
          });

          players.on({
            'show:modal' : this.showModal,
            'reset' : function(){ 
              this.data.tournament.fetch({ async: false });
              this.loadSection( 'players' );
            }
          }, this); 

          this.contentRegion.show( players );
          break;
        case 'referee':
          this.contentRegion.show( new TournamentReferee() );
          break;
        case 'news':
          this.data.posts.fetch({ async: false });

          var news = new TournamentNews({
            item: this.data.tournament,
            collection: this.data.posts
          });
          news.on( 'show:modal', this.showModal, this );

          this.contentRegion.show( news );
          break;
        case 'gallery':
          this.data.gallery.fetch({ async: false });
          var gallery = new TournamentGallery({
            item: this.data.tournament,
            collection: this.data.gallery
          });
          gallery.on( 'show:modal', this.showModal, this );

          this.contentRegion.show( gallery );
          break;
      }
    },

    showModal: function( view ) {
      this.modalRegion.show( view );
    },

    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.sidebarRegion.show( this.sidebar );
    },

    onShow: function() {
      debug( 'displayed' );
      this.loadSection( 'stats' );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return layout definition as module export
  module.exports = TournamentHomeLayout;
});
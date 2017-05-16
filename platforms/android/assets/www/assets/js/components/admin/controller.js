define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:controller' );

  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie   = require( 'valkie' );
  var mediator = require( 'mediator' );
  var utils    = require( 'helpers/utils' );

  // Models
  var UserModel   = require( 'models/user' );
  var TeamModel   = require( 'models/team' );
  var LeagueModel = require( 'models/league' );
  var TournamentModel = require( 'models/tournament' );
  var TournamentsCollection = require( 'models/tournaments' );

  // Views
  var HeaderMenu = require( './views/header' );

  // Tournament Views
  var TournamentsList = require( './tournament/views/tournaments' );
  var NewTournamentForm = require( './tournament/views/newTournament' );
  var TournamentHomeLayout = require( './tournament/views/homeLayout' );

  // League Views
  var LeagueEditLayout = require( './league/views/editLayout' );

  // General profile views
  var TeamProfile   = require( 'components/site/team/views/layout' );
  var PlayerProfile = require( 'components/site/player/views/layout' );
  var LeagueProfile = require( 'components/site/league/views/layout' );

  // Controller definition
  var AdminController = Valkie.Controller.extend({
    // Initial setup
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );

      // The layout view used as the main component UI is
      // initialized at the component level ( index.js );
      // the mediator usre is already a UserModel instance
      this.layout = options.ui;
      this.user   = mediator.user;
      this.data = {};

      // Load league details
      this.data.league = new LeagueModel();
      this.data.league.set( '_id', this.user.get( 'leagues' )[0] );
      this.data.league.fetch({ async: false });

      // Load league tournaments
      this.data.tournaments = new TournamentsCollection();
      this.data.tournaments.url = 'https://www.somosfut.com/league/' + this.data.league.id + '/tournaments';
      this.data.tournaments.fetch({ async: false });

      
      // If the profile is filled and this is a mobile user check
      // for a valid token device
      if( mediator.inPhoneGap() ) {
        var self = this;
        var devices = self.user.get( 'extras.devices' );
        if( ! devices || devices.length === 0 ) {
          // Configure push notifications
          /*var push = PushNotification.init({
            "ios": {
              "alert": "true",
              "badge": "true"
            }
          });

          // Add device
          push.on( 'registration', function( data ) {
            self.user.addDeviceToken( data.registrationId, function( res ) {
              if( res ) {
                utils.message( 'success', 'Exito', 'DEVICE_REGISTERED' );
              }
            }, self );
          });

          // Listen for notifications
          push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
          });*/
        }
      }
    },

    // Choose initial state based on required profile information
    index: function() {
      debug( 'on method: _index_' );
      window.location.hash = '#home';
    },

    // League admin home
    home: function() {
      debug( 'on method: _home_' );
      $( 'body' ).removeClass().addClass( 'app' );

      // Load Basic Layout when missing
      if( ! this.layout.contentRegion.hasView() )
        this._showHomeLayout();

      this._loadTournamentsList();
    },

    // Show new tournament form on as modal
    newTournament: function() {
      debug( 'on method: _newTournament_' );

      // Load Basic Layout when missing
      if( ! this.layout.contentRegion.hasView() ) {
        this._showHomeLayout();
        this._loadTournamentsList();
      }

      var collection = this.data.tournaments;
      var form = new NewTournamentForm();
      form.on( {
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( data ) {
          debug( 'store new tournament' );
          data.league = this.data.league.id;

          var tournament = new TournamentModel( data );
          tournament.save().done( function() {
            utils.message( 'success', 'OK', 'TOURNAMENT_REGISTERED_OK' );
            collection.add( tournament );
          });
        }
      }, this );
      this.layout.modalRegion.show( form );
    },

    // Tournament home layout
    homeTournament: function( id ) {
      debug( 'on method: _homeTournament_' );

      $( 'body' ).removeClass().addClass( 'app' );
      this.layout.headerRegion.show( new HeaderMenu({
        model: this.user,
        league: this.data.league
      }));
      this.layout.contentRegion.empty();
      this.layout.ui.content.html( '' );

      // Render home layout
      var tournament = this.data.tournaments.findWhere({ _id: id });
      
      var home = new TournamentHomeLayout({ tournament: tournament });
      this.layout.contentRegion.show( home );
    },

    // League information form
    editLeague: function() {
      debug( 'on method: _editLeague_' );

      // Load Basic Layout when is missing
      if( ! this.layout.contentRegion.hasView() )
        this._showHomeLayout();

      // Cleanup
      this.layout.contentRegion.empty();
      this.layout.ui.content.html( '' );

      // Render edit layout
      var edit = new LeagueEditLayout({ league: this.data.league });
      this.layout.contentRegion.show( edit );
    },

    // End session and fire a reload
    logout: function() {
      debug( 'on method: _logout_' );
      mediator.commands.execute( 'endSession' );
    },

    // Common player profile
    profilePlayer: function( url ) {
      debug( 'on method: _profilePlayer_' );

      // Create player instance and listen for notifications
      var player = new UserModel();
      player.on( 'notify', function( msg ) {
        utils.message( msg.status, msg.status.toUpperCase(), msg.desc );
      });

      player.getFromURL( url, function( ok ) {
        if( ok ) {
          // Load player layout on content region
          var playerProfile = new PlayerProfile({ player : player });
          this.layout.contentRegion.show( playerProfile );

          if ( ! this.layout.headerRegion.hasView() ) {
            this.layout.headerRegion.show( new HeaderMenu({
              model: this.user,
              league: this.data.league
            }));
          }
        }
      }, this );
    },

    // Common team profile
    profileTeam: function( url ) {
      debug( 'on method: _profileTeam_' );

      // Create team instance and listen for notifications
      var team = new TeamModel();
      team.on( 'notify', function( msg ) {
        utils.message( msg.status, msg.status.toUpperCase(), msg.desc );
      }, this );

      // Load team from URL value
      team.getFromURL( url, function( ok ) {
        if( ok ) {
          // Load team layout on content region
          var teamProfile = new TeamProfile({ team: team });
          this.layout.contentRegion.show( teamProfile );

          if ( ! this.layout.headerRegion.hasView() ) {
            this.layout.headerRegion.show( new HeaderMenu({
              model: this.user,
              league: this.data.league
            }));
          }
        }
      }, this );
    },

    // Common league profile
    profileLeague: function( url ) {
      debug( 'on method: _profileLeague_' );

      // Create league instance and listen for notifications
      var league = new LeagueModel();
      league.on( 'notify', function( msg ) {
        utils.message( msg.status, msg.status.toUpperCase(), msg.desc );
      }, this );

      // Load league from URL value
      league.getFromURL( url, function( ok ) {
        if( ok ) {
          // Load league layout on content region
          var leagueProfile = new LeagueProfile({ league: league });
          this.layout.contentRegion.show( leagueProfile );

          if ( ! this.layout.headerRegion.hasView() ) {
            this.layout.headerRegion.show( new HeaderMenu({
              model: this.user,
              league: league
            }));
          }
        }
      }, this );
    },

    _showHomeLayout: function() {
      $( 'body' ).removeClass().addClass( 'app' );
      this.layout.headerRegion.show( new HeaderMenu({
        model: this.user,
        league: this.data.league
      }));
    },

    _loadTournamentsList: function() {
      this.layout.contentRegion.empty();
      this.layout.ui.content.html( '' );

      var list = new TournamentsList({ collection: this.data.tournaments });
      this.layout.contentRegion.show( list );
    },

    notFound: function() {
      debug( 'on method: _notFound_' );
      // Redirect to home layout
      window.location.hash = '#home';
    },

    _resetURL: function( val ) {
      debug( 'reset url to value: %s', val );
      this.trigger( 'reset:url', val );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return controller definition as module export
  module.exports = AdminController;
});

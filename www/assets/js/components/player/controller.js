define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:controller' );

  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie   = require( 'valkie' );
  var utils    = require( 'helpers/utils' );
  var mediator = require( 'mediator' );

  // Models
  var UserModel   = require( 'models/user' );
  var TeamModel   = require( 'models/team' );
  var LeagueModel = require( 'models/league' );
  var TeamsCollection = require( 'models/teams' );

  // General views
  var HeaderMenu = require( './views/header' );

  // Register views
  var RegisterProfile = require( './register/views/profile' );
  var NewTeamForm     = require( './register/views/newTeam' );
  var JoinTeamForm    = require( './register/views/joinTeam' );
  var CouponsModal    = require( './register/views/couponsModal' );

  // Team views
  var TeamsList  = require( './team/views/teams' );
  var TeamLayout = require( './team/views/layout' );

  // General profile views
  var TeamProfile   = require( 'components/site/team/views/layout' );
  var PlayerProfile = require( 'components/site/player/views/layout' );
  var LeagueProfile = require( 'components/site/league/views/layout' );
  var Coupons = require('./coupons/coupons')

  // Controller definition
  var PlayerController = Valkie.Controller.extend({
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );

      // The layout view used as the main component UI is
      // initialized at the component level ( index.js );
      // the mediator user is already a UserModel instance
      this.layout = options.ui;
      this.user   = mediator.user;

      // If the profile is filled and this is a mobile user check
      // for a valid token device
      /*if( mediator.inPhoneGap() ) {
        var self = this;
        var devices = self.user.get( 'extras.devices' );
        if( ! devices || devices.length === 0 ) {
          // Configure push notifications
          var push = PushNotification.init({
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
          });
        }
      }*/
    },

    // Choose initial state based on required profile information
    index: function() {
      debug( 'on method: _index_' );
      
      // If the user is not on any team create or join one
      if( this.user.get( 'teams' ).length === 0 ) {
        window.location.hash = '#register/team';
        return;
      }
      
      // The profile is filled and the user is linked to at least one team,
      // go ahead to the home interface
      window.location.hash = '#home';
    },

    // Load main profile form
    registerProfile: function() {
      debug( 'on method: _registerProfile_' );
      
      // Add body class and load basic HTML for the header
      $( 'body' ).removeClass().addClass( 'register' );
      this.layout.contentRegion.show( new RegisterProfile({
        model: this.user })
      );
    },
    
    // Allow the user to create or join a team
    registerTeam: function() {
      debug( 'on method: _registerTeam_' );

      // Add body class and load basic HTML for the content area
      $( 'body' ).removeClass().addClass( 'register' );
      var content = require( 'text!./register/views/templates/team.hbs' );
      var header  = require( 'text!./register/views/templates/header.hbs' );
      this.layout.ui.content.html( content );
      this.layout.ui.header.html( header );
    },
    
    // Display modal box to create a new team
    registerNewTeam: function() {
      debug( 'on method: _registerNewTeam_' );

      // Load Basic Layout when is missing
      if( ! this.layout.contentRegion.hasView() )
        this._showHomeLayout();

      // Create new team instance
      var team = new TeamModel();
      team.set({
        admins : [this.user.id],
        token  : utils.makeToken( 2, 4 )
      });
      
      // Create form and display it as a modal
      var user = this.user;
      var form = new NewTeamForm({
        model : team,
        user  : mediator.user
      });
      form.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( data, view ) {
          // Set the provided name and store the team record
          team
            .set( data )
            .save()
            .done( function( response, status ) {
              if( status === 'success' ) {
                debug( 'team saved with id: %s', team.id );
                utils.message( 'success', 'Exito', 'TEAM_REGISTERED' );
                
                // Add team to the user, save it and reload
                var currentTeams = user.get( 'teams' );
                for( var i = 0; i < currentTeams.length; i++ ) {
                  currentTeams[ i ] = currentTeams[ i ]._id;
                }
                currentTeams.push( team.id );
                user.patch({ teams: currentTeams });
                user.fetch({ async: false });

                // Hide modal
                view.$el.modal( 'hide' );
                
                // Load team home
                window.location.hash = '#team/home/' + team.id;
                return;
              }
              else {
                // Display error
                utils.message( 'error', 'Error', response.desc );
              }
          });
        }
      }, this );
      this.layout.modalRegion.show( form );
      
    },
    
    // Ask for team token to join using a modal view
    registerJoinTeam: function() {
      debug( 'on method: _registerJoinTeam_' );


      // Load Basic Layout when is missing
      if( ! this.layout.contentRegion.hasView() )
        this._showHomeLayout();

      var form = new JoinTeamForm({ user : mediator.user });
      
      // Configure form and display it
      form.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( token, view ) {
          debug( 'submit join request for team: %s', token );
          this.user.joinTeam( token, function( team ) {
            if( team ) {
              view.$el.modal( 'hide' );
              utils.message( 'success', 'Exito', 'TEAM_JOINED' );
              window.location.hash = '#team/home/' + team._id;
            }
            else {
              view.ui.token
              .addClass( 'validator-error' )
              .attr( 'title', 'El token de tu equipo no es valido, porfavor verifícalo' ); 
            }
          }, this );
        }
      }, this );
      this.layout.modalRegion.show( form );
    },
    
    // Load team layout
    teamHome: function( id ) {
      debug( 'on method: _teamHome_ for team: %s', id );
      
      // Cleanup and header menu
      $( 'body' ).removeClass().addClass( 'app' );
      this.layout.headerRegion.show( new HeaderMenu({ model: this.user }) );
      this.layout.contentRegion.empty();
      this.layout.ui.content.html( '' );
      
      // Fetch team instance
      var team = new TeamModel();
      team.set( '_id', id );
      team.fetch({
        context: this,
        error: function( model, req ) {
          var error = req.responseJSON;
          utils.message( 'error', 'Error', error.desc );
        }
      }).done( function() {
        // Determine if the user is a team admin
        var isAdmin = team.get( 'admins' ).indexOf( this.user.id );
        isAdmin = ( isAdmin > -1 );
        
        // Listen for changes
        team.on( 'change', function(){
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        });
        
        // Update layout content
        var teamhome = new TeamLayout({
          team: team,
          user: this.user,
          isAdmin: isAdmin
        });
        this.layout.contentRegion.show( teamhome );
      });
    },
    
    // Load user home interface
    home: function() {
      debug( 'on method: _home_' );
      this._showHomeLayout();

      // If the user is not on any team create or join one
      if( this.user.get( 'teams' ).length === 0 ) {
        window.location.hash = '#register/team/new';
        return;
      }

      // If the user dont have see the coupons tour
      if (!this.user.get('tours').coupons) {
        var couponsModal = new CouponsModal()

        couponsModal.on({
          'tours:clear': function (tourName) {
            mediator.user.clearTours(tourName)
          }
        }, this)

        this.layout.modalRegion.show(couponsModal);
      }
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
          var playerProfile = new PlayerProfile({
            player : player,
            user: this.user,
            isOwner: player.id === this.user.id
          });
          this.layout.contentRegion.show( playerProfile );

          if ( ! this.layout.headerRegion.hasView() ) {
            this.layout.headerRegion.show( new HeaderMenu({ model: player }) );
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
            this.layout.headerRegion.show( new HeaderMenu({ model: this.user }) );
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
            this.layout.headerRegion.show( new HeaderMenu({ model: this.user }) );
          }
        }
      }, this );
    },

    coupons: function () {
      var coupons = new Coupons()

      $( 'body' ).removeClass().addClass( 'app' );
      this.layout.headerRegion.show( new HeaderMenu({ model: this.user }) );
      this.layout.contentRegion.show(coupons)
    },

    notFound: function() {
      debug( 'on method: _notFound_' );
      // Redirect to home layout
      window.location.hash = '#home';
    },
    
    _resetURL: function( val ) {
      debug( 'reset url to value: %s', val );
      this.trigger( 'reset:url', val );
    },

    // Show the basic layout when the page is reload
    _showHomeLayout: function() {
      $( 'body' ).removeClass().addClass( 'app' );
      this.layout.headerRegion.show( new HeaderMenu({ model: this.user }) );
      this.layout.contentRegion.empty();
      this.layout.ui.content.html( '' );

      // Show user teams list as a temporary home screen
      this.user.fetch({ async: false });
      var teams = new TeamsCollection( this.user.get( 'teams' ) );
      this.layout.contentRegion.show( new TeamsList({ collection: teams }) );      
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return controller definition as module export
  module.exports = PlayerController;
});

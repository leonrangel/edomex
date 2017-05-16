define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var $      = require( 'jquery' );
  var debug  = require( 'debug' )( 'module:site:controller' );

  // Module dependencies
  var Valkie   = require( 'valkie' );
  var mediator = require( 'mediator' );
  //mediator.clearSession();
  //alert('clear');
  var utils    = require( 'helpers/utils' );

  // Required elements
  var MenuView          = require( './info/views/header' );
  var IntroVideo        = require( './views/video' );
  var LoginForm         = require( './views/login' );
  var RegisterForm      = require( './views/register' );
  var RegisterAdminForm = require( './views/registerAdmin' );
  var ResetPassForm     = require( './views/reset' );
  var ResendEmailForm   = require( './views/resend' );
  var InfoLayout        = require( './info/views/layout' );
  var LeagueLayout      = require( './league/views/layout' );
  var TeamLayout        = require( './team/views/layout' );
  var PlayerLayout      = require( './player/views/layout' );

  // Mobile views
  var MobileLoginForm   = require( './views/mobileLogin' );
  var MobilePlayerForm   = require( './views/mobilePlayer' );

  // Models
  var UserModel = require( 'models/user' );
  var TeamModel = require( 'models/team' );
  var LeagueModel = require( 'models/league' );

  // Controller definition
  var SiteController = Valkie.Controller.extend({
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );

      // The layout view used as the main component UI is
      // initialized at the component level ( index.js )
      this.layout = options.ui;
    },

    index: function() {
      debug( 'on method: _index_' );
      if( mediator.inPhoneGap() ) {
        // Load login form by default on mobile devices
        window.location.hash = '#mobile/player';
      } else {
        this._defaultContent();
      }
    },

    mobileLogin: function() {
      debug( 'on method: _mobileLogin_' );
      var loginForm = new MobileLoginForm();
      loginForm.on({
        'submit': function( credentials ) {
          mediator.user.login( credentials, function( session ) {
            if( session ) {
              debug( 'session started: %o', session );
              mediator.commands.execute( 'startSession', session );
            }
          });
        },
        'handleFacebookLogin': this.handleFacebookLogin
      }, this );
      this.layout.contentRegion.show( loginForm );
      this.layout.footerRegion.empty();
      $( 'body' ).addClass( 'mobile' );
    },

    mobilePlayer: function() {
      this.layout.contentRegion.show( new MobilePlayerForm() );
      this.layout.footerRegion.empty();
      $( 'body' ).addClass( 'mobile' );
    },

    showLeagues: function() {
      debug( 'on method: _showLeagues_' );
      this._defaultContent( 'leagues' );
    },

    showTeams: function() {
      debug( 'on method: _showTeams_' );
      this._defaultContent( 'teams' );
    },

    showPlayers: function() {
      debug( 'on method: _showPlayers_' );
      this._defaultContent( 'players' );
    },

    showPrivacy: function() {
      debug( 'on method: _showPlayers_' );
      this._defaultContent('privacy');
    },

    video: function() {
      debug( 'on method: _video_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }
      this.layout.modalRegion.show( new IntroVideo() );
    },

    login: function() {
      debug( 'on method: _login_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      // Configure and display login form view
      var loginForm = new LoginForm();
      loginForm.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( credentials ) {
          mediator.user.login( credentials, function( session ) {
            if( session ) {
              debug( 'session started: %o', session );
              mediator.commands.execute( 'startSession', session );
            }
          });
        },
        'handleFacebookLogin': this.handleFacebookLogin
      }, this );
      this.layout.modalRegion.show( loginForm );
    },

    register: function() {
      debug( 'on method: _register_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      // Configure and display register form view
      var registerForm = new RegisterForm();
      registerForm.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( data ) {
          mediator.user
            .clear()
            .register(data, 'basic');
        },
        'handleFacebookLogin': this.handleFacebookLogin
      }, this );
      this.layout.modalRegion.show( registerForm );
    },

    handleFacebookLogin: function (fbOauthRes) {
      mediator.user.facebookLogin(fbOauthRes, function (session) {
        if (session) {
          mediator.commands.execute('startSession', session);
        }
      });
    },

    reset: function() {
      debug( 'on method: _reset_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      var resetForm = new ResetPassForm();
      resetForm.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( email ) {
          var user = new UserModel();
          user.on( 'notify', function( msg ){
            utils.message( msg.status, msg.status.toUpperCase(), msg.desc );
          });
          user.resetPass( email, function( res ){
            if( res ) {
              utils.message( 'success', 'OK', 'RESET_PASS_SUCCESS' );
            }
          }, this );
        }
      }, this );
      this.layout.modalRegion.show( resetForm );
    },

    resend: function() {
      debug( 'on method: _resend_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      var resendForm = new ResendEmailForm();
      resendForm.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        },
        'submit': function( email ) {
          var user = new UserModel();
          user.on( 'notify', function( msg ){
            utils.message( msg.status, msg.status.toUpperCase(), msg.desc );
          });
          user.resendActivation( email, function( res ){
            if( res ) {
              utils.message( 'success', 'OK', 'RESEND_ACTIVATION_SUCCESS' );
            }
          }, this );
        }
      }, this );
      this.layout.modalRegion.show( resendForm );
    },

    registerAdmin: function() {
      debug( 'on method: _registerAdmin_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      // Configure and display register form view
      var registerAdminForm = new RegisterAdminForm();
      registerAdminForm.on({
        'modal:closed': function() {
          this._resetURL( '_' );
        }
      }, this );
      this.layout.modalRegion.show( registerAdminForm );
    },

    verify: function( token ) {
      debug( 'on method: _verify_' );
      if( ! this.layout.contentRegion.hasView() ) {
        this._defaultContent();
      }

      // Run verify command
      mediator.user.verify( token, function( session ) {
        if( session ) {
          debug( 'session started: %o', session );
          mediator.commands.execute( 'startSession', session );
        }
      });
    },

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
          var playerProfile = new PlayerLayout({ player : player });
          this.layout.contentRegion.show( playerProfile );

          // Load minimal menu on the header area
          this.layout.headerRegion.show( new MenuView({ minimal: true }) );
        } else {
          this._defaultContent();
        }
      }, this );
    },

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
          var teamProfile = new TeamLayout({ team: team });
          this.layout.contentRegion.show( teamProfile );

          // Load minimal menu on the header area
          this.layout.headerRegion.show( new MenuView({ minimal: true }) );
        } else {
          this._defaultContent();
        }
      }, this );
    },

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
          var leagueProfile = new LeagueLayout({ league: league });
          this.layout.contentRegion.show( leagueProfile );

          // Load minimal menu on the header area
          this.layout.headerRegion.show( new MenuView({ minimal: true }) );
        } else {
          this._defaultContent();
        }
      }, this );
    },

    notFound: function() {
      debug( 'on method: _notFound_' );
      // Redirect to home layout
      window.location.hash = '#';
    },

    _defaultContent: function( section ) {
      if( ! this.layout.contentRegion.hasView() ) {
        // Show InfoLayout on content region and it's header on headerRegion
        var info = new InfoLayout();
        this.layout.contentRegion.show( info );
        this.layout.headerRegion.show( info.header );
      }
      this.layout.contentRegion.currentView.section( section || '' );
    },

    _resetURL: function( val ) {
      debug( 'reset URL' );
      this.trigger( 'reset:url', val );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return controller definition as module export
  module.exports = SiteController;
});

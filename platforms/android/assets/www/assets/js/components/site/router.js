define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:router' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // Main component controller
  var SiteController = require( './controller' );

  // Router definition
  var SiteRouter = Valkie.Router.extend({
    // Controller routes
    appRoutes: {
      ''               : 'index',
      '_'              : 'index',
      'leagues'        : 'showLeagues',
      'teams'          : 'showTeams',
      'players'        : 'showPlayers',
      'privacy'        : 'showPrivacy',
      'video'          : 'video',
      'login'          : 'login',
      'register'       : 'register',
      'reset'          : 'reset',
      'resend'         : 'resend',
      'register/admin' : 'registerAdmin',
      'verify/:token'  : 'verify',
      'jugador/:url'   : 'profilePlayer',
      'equipo/:url'    : 'profileTeam',
      'liga/:url'      : 'profileLeague',
      'mobile/login'   : 'mobileLogin',
      'mobile/player'   : 'mobilePlayer',
      '*notFound'      : 'notFound'
    },

    // Constructor method
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );
      this.controller = new SiteController( options );
      this.controller.on( 'reset:url', function( val ) {
        this.navigate( val, { trigger: false });
      }, this );
    },

    // Callback for route changes
    onRoute: function( route, path, params ) {
      debug( 'navigated to route: %s with params: %o', route, params );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return router definition as module export
  module.exports = SiteRouter;
});

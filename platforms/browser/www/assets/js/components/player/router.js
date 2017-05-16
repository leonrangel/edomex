define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:router' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Main component controller
  var PlayerController = require( './controller' );
  
  // Router definition
  var PlayerRouter = Valkie.Router.extend({
    // Controller routes
    appRoutes: {
      ''                   : 'index',
      'logout'             : 'logout',
      'register/profile'   : 'registerProfile',
      'register/team'      : 'registerTeam',
      'register/team/new'  : 'registerNewTeam',
      'register/team/join' : 'registerJoinTeam',
      'team/home/:id'      : 'teamHome',
      'home'               : 'home',
      'jugador/:url'       : 'profilePlayer',
      'equipo/:url'        : 'profileTeam',
      'liga/:url'          : 'profileLeague',
      'cupones'            : 'coupons',
      '*notFound'          : 'notFound'
    },
    
    // Constructor method
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );
      this.controller = new PlayerController( options );
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
  module.exports = PlayerRouter;
});

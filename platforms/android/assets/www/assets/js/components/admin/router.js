define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:admin:router' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Main component controller
  var AdminController = require( './controller' );
  
  // Router definition
  var AdminRouter = Valkie.Router.extend({
    // Controller routes
    appRoutes: {
      ''                    : 'index',
      'home'                : 'home',
      'new/tournament'      : 'newTournament',
      'home/tournament/:id' : 'homeTournament',
      'edit/league'         : 'editLeague',
      'logout'              : 'logout',
      'jugador/:url'       : 'profilePlayer',
      'equipo/:url'        : 'profileTeam',
      'liga/:url'          : 'profileLeague',
      '*notFound'          : 'notFound'
    },
    
    // Constructor method
    initialize: function( options ) {
      debug( 'initializing with options: %o', options );
      this.controller = new AdminController( options );
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
  module.exports = AdminRouter;
});

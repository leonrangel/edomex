define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'app' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var mediator = require( 'mediator' );


  // Usar para terminar la session
  //mediator.clearSession();

  // Individual component definitions
  var SiteComponent   = require( 'components/site/index' );
  var PlayerComponent = require( 'components/player/index' );
  var AdminComponent  = require( 'components/admin/index' );

  // Application definition
  var SomosFut = Valkie.Application.extend({
    // State holder
    state: {
      currentComponent: false
    },

    // Define main UI regions
    regions: {
      'mainRegion' : '#main'
    },

    // Constructor method
    initialize: function() {
      debug( 'constructor' );
    },

    // Setup before starting up
    onBeforeStart: function( options ) {
      debug( 'about to start with options: %o', options );

      // Load SVG files
      $( 'div.svg-loader' ).each( function( index, file ) {
        file = $( file );
        debug( 'loading SVG file: %s', file.data( 'svg-file' ) );
        file.load( file.data( 'svg-file' ) );
      });

      // Load behaviors
      Valkie.Behaviors.behaviorsLookup = function() {
        return {
          tooltip        : require( 'behaviors/tooltip' ),
          dropdown       : require( 'behaviors/dropdown' ),
          datepicker     : require( 'behaviors/datepicker' ),
          popover        : require( 'behaviors/popover' ),
          affix          : require( 'behaviors/affix' ),
          tabs           : require( 'behaviors/tabs' ),
          modal          : require( 'behaviors/modal' ),
          accordion      : require( 'behaviors/accordion' ),
          validator      : require( 'behaviors/validator' ),
          differentTeams : require( 'behaviors/differentTeams' )
        }
      }

      // Get user location when running in desktop environment
      if( typeof process !== 'undefined' ) {
        // Get user location if available
        if( navigator.geolocation ) {
          debug( 'requesting user position' );
          navigator.geolocation.getCurrentPosition( function( position ) {
            mediator.userLocation = {
              lat      : position.coords.latitude,
              long     : position.coords.longitude,
              accuracy : position.coords.accuracy
            };
            debug( 'user located: %o', mediator.userLocation );
          });
        }
      }

      // Register commonly used template helpers
      var helperMethods = require( 'helpers/template_helpers' );
      for( var helper in helperMethods ) {
        if( helperMethods.hasOwnProperty( helper ) ) {
          Valkie.templateHelper( helper, helperMethods[helper] );
        }
      }

      // Load application individual components
      this.module( 'site', SiteComponent );
      this.module( 'player', PlayerComponent );
      this.module( 'admin', AdminComponent );

      // Listen for reload events
      mediator.on( 'reload', this.load, this );
    },

    // Kickstart method once the app has been started
    onStart: function( options ) {
      debug( 'started with options: %o', options );

      // Start and display first component
      this.load( options );

      // Start routing
      Valkie.kickstart();
    },

    // Manage the current component on screen
    load: function( options ) {

//       function deleteAllCookies() {
//     var cookies = document.cookie.split(";");

//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i];
//       var eqPos = cookie.indexOf("=");
//       var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//       document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }
// deleteAllCookies(); return;

    //mediator.clearSession();

      // Empty options hash if non are provided
      if( ! options ) { options = {}; }

      // Determine right component, by the default is 'site', once the user
      // is logged in the component is based on the user 'type' property
      var component = false;
      var session   = mediator.session();
      if( ! session ) {
        component = 'site';
      } else {
        component = session.user.type;
      }

      // Stop the current component, if any
      if( this.state.currentComponent ) {
        debug( 'stopping component: %s', this.state.currentComponent );
        this.mainRegion.empty();
        this.module( this.state.currentComponent ).stop();
      }

      // Start requested component
      debug( 'starting component: %s', component );
      this.state.currentComponent = component;
      this.module( component ).start( options );
      this.mainRegion.show( this.module( component ).ui );

      // Load index on forced reloads
      if( options.force ) {
        window.location.hash = '#';
      }
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  var somosfut = new SomosFut();
  if( mediator.inPhoneGap() ) {
    // Wait for the 'DeviceReady' event to start the app on phonegap
    debug( 'running in phonegap environment' );
    document.addEventListener( 'deviceready', function() {
      somosfut.start();
    });
  } else {
    debug( 'running in browser' );
    somosfut.start();
  }

  // Return application instance as module export
  module.exports = somosfut;
});

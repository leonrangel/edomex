/* jshint maxstatements:30 */
define(function( require, exports, module ) {
  'use strict';

  // Module dependencies
  require( 'bb.marionette' );
  require( 'bb.deepmodel' );
  require( 'bb.stickit' );
  var _  = require( 'underscore' );
  var $  = require( 'jquery' );
  var L  = require( 'ui.map' );
  var BB = require( 'backbone' );
  var HB = require( 'handlebars' );
  var utils = require( 'helpers/utils' );

  //Adding if coditionals to handlebars
  HB.registerHelper('isNull', function (value, options) {
    if ( value === null ) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  HB.registerHelper('ifEquals', function (v1, v2, options) {
    if ( v1 === v2 ) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  // Module exports
  var Valkie = {};

  // Communication channels
  Valkie.radio = BB.Wreqr.radio;

  // Structural classes used as-is
  Valkie.Object      = BB.Marionette.Object;
  Valkie.Application = BB.Marionette.Application;
  Valkie.Controller  = BB.Marionette.Controller;
  Valkie.Module      = BB.Marionette.Module;
  Valkie.Behavior    = BB.Marionette.Behavior;
  Valkie.Behaviors   = BB.Marionette.Behaviors;

  // Base router to use since Marionette already extends BB's version
  Valkie.Router = BB.Marionette.AppRouter;

  // Base model implementation
  Valkie.Model = BB.Model.extend({
    // Used to store the document identifier
    idAttribute: '_id',

    // Get a plain text representation of the model, useful for storage
    serialize: function() {
      return JSON.stringify( this.toJSON() );
    },

    // Update the model using the PATCH HTTP verb and sending only
    // the supplied attributes to the server
    patch: function( attrs, options ) {
      // Used model's own changes if no attributes are specified
      if( ! attrs ) {
        attrs = this.changedAttributes();
      }

      if( ! options ) {
        options = {};
      }
      options.patch = true;

      // Save as PATCH request
      this.save( attrs, options );
    },

    // Utility method to send HTTP requests to the backend server
    // @return jqXHR
    _sendRequest: function( params ) {
      // Set default parameters values
      _.defaults( params, {
        url: this.url(),
        type: 'GET',
        async: true,
        headers: {},
        data: '',
        context: this
      });

      // All requests ( except GET ) use json data by default
      if( params.type.toUpperCase() !== 'GET' &&
          params.contentType === undefined ) {
        params.data = JSON.stringify( params.data );
        params.contentType = 'application/json';
      }

      // Return the jqXHR object
      return $.ajax( params );
    },

    // Notifies to the front that some error ocurred.
    // @param req The req that contains the error
    _notifyError: function( req ) {
      utils.message( req.status, req.status.toUpperCase(), req.desc );
    },

    _notifySuccess: function( content ) {
      utils.message( 'success', 'Ok', content );
    }
  });

  // Base collection implementation
  Valkie.Collection = BB.Collection.extend({
    // Pull models from the server and add only new ones to the collection
    update: function( options ) {
      // Basic parameters
      var params = {
        add: true
      };

      // Add supplied params
      if( options && _.isObject( options ) ) {
        _.extend( params, options );
      }

      // Send request
      this.fetch( params );
    },

    // Allow to apply a filter to items in a collection without losing data
    applyFilter: function( filter ) {
      // Store a copy of all the models if not already created
      if( ! this.allModels ) {
        this.allModels = _.clone( this.models );
      }

      // Apply filter
      this.set( this.allModels, { silent: true });
      if( _.isFunction( filter ) ) {
        this.set( _.filter( this.allModels, function( item ) {
          return filter( item );
        } ) );
      } else {
        this.set( this.where( filter ) );
      }
    },

    // Remove any previously applied filter to the collection, if any
    clearFilter: function() {
      this.allModels ? this.set( this.allModels ) : this.set( this.models );
    }
  });

  // Base ItemView custom implementation
  Valkie.ItemView = BB.Marionette.ItemView.extend({
    // Enable data binding
    bindModelAttributes: function() {
      this.stickit();
      return this;
    },

    unbindModelAttributes: function() {
      this.unstickit();
      return this;
    }
  });

  // Specialized views used as-is
  Valkie.View           = BB.Marionette.View;
  Valkie.CollectionView = BB.Marionette.CollectionView;
  Valkie.CompositeView  = BB.Marionette.CompositeView;
  Valkie.LayoutView     = BB.Marionette.LayoutView;

  // Map generator helper method
  Valkie.Map = function( options ) {
    var tiles = {
      // Some of this URLs are very long
      // jshint maxlen:130
      osm       : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      bw        : 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png',
      hot       : 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      forest    : 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
      outdoors  : 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
      roads     : 'http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}',
      gray      : 'http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}',
      toner     : 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
      tonerBg   : 'http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png',
      tonerGray : 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
      waterColor: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
      acetate   : 'http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png',
      satellite : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      grayCanvas: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    };

    // Merge provided config with default values
    options = _.defaults( options, {
      style              : 'roads',
      center             : [0, 0],
      zoom               : 14,
      minZoom            : 7,
      maxZoom            : 16,
      zoomControl        : false,
      attributionControl : false,
      retina             : true,
      accuracy           : false,
      interactive        : true,
      dragging           : true,
      touchZoom          : true,
      doubleClickZoom    : true,
      scrollWheelZoom    : true,
      boxZoom            : true
    });

    // Disable interactive features ?
    if( ! options.interactive ) {
      options.dragging        = false;
      options.touchZoom       = false;
      options.doubleClickZoom = false;
      options.scrollWheelZoom = false;
      options.boxZoom         = false;
    }

    // Set layers object
    options.layers = L.tileLayer( tiles[ options.style ], {
      detectRetina : options.retina
    });

    // Create map instance and return it
    var map = L.map( options.holder, options );
    return map;
  };

  // Application kickstart method
  Valkie.kickstart = function() {
    BB.history.start();
  };

  // Main template definition method
  Valkie.template = function( text ) {
    return HB.compile( text );
  };

  // Register a template helper method
  Valkie.templateHelper = function( name, method ) {
    HB.registerHelper( name, method );
  };

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return framework definition as module export
  module.exports = Valkie;
});

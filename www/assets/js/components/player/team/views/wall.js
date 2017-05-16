define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:wall' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var WallCell = require( './wallCell' );

  // View definition
  var TeamWall = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/wall.hbs' ) ),
    childView: WallCell,
    childViewContainer: 'div.posts-list',
    childViewOptions: {},
    
    behaviors: {
      'validator': {
        successHandler: 'save'
      }
    },
    
    ui: {
      'publish' : '#publish',
      'postForm' : '#postForm',
      'postContent' : '#postContent',
      'counter' : 'span.counter'
    },
    
    events: {
      'keyup @ui.postContent' : 'updateCounter'
    },
    
    initialize: function( options ) {
      this.isAdmin = options.isAdmin;
      this.childViewOptions = {
        isAdmin: this.isAdmin,
        user: options.user
      };
    },
    
    save: function() {
      debug( 'save new post' );
      this.trigger( 'save:post', this.ui.postContent.val() );
      this.ui.postContent.val( '' );
    },
    
    updateCounter: function() {
      //this.ui.counter.text( this.ui.postContent.val().length );
    },
    
    onRender: function() {
      debug( 'rendered' );
      this.bindUIElements();
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // View definition as module export
  module.exports = TeamWall;
});
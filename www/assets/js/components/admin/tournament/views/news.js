define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:news' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils       = require( 'helpers/utils' );
  var PostCell    = require( './postCell' );
  var NewPostForm = require( './newPost' );
  
  // View definition
  var TournamentNews = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/news.hbs' ) ),
    childView: PostCell,
    childViewContainer: 'div.content-list ul',
    childEvents: {
      'edit'   : 'editPost',
      'delete' : 'deletePost'
    },
    
    ui: {
      'create'   : 'button.create',
      'loadMore' : 'a.load-more-content'
    },
    
    events: {
      'click @ui.loadMore': 'loadMore',
      'click @ui.create'  : 'newPost'
    },
    
    newPost: function() {
      debug( 'show new post form' );
      
      var form = new NewPostForm();
      form.on( 'submit', function( post ) {
        post.team = null;
        post.date = Date.now();
        post.author = null;
        post.tournament = this.options.item.id;
        this.collection.create( post, {
          error: function() {
            utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
          },
          success:function() {
            utils.message( 'success', 'OK', 'CHANGES_STORED' );
          }
        });
      }, this );
      this.trigger( 'show:modal', form );
    },
    
    editPost: function( cell ) {
      debug( 'edit selected post' );
    },
    
    deletePost: function( cell ) {
      debug( 'delete selected post' );
      cell.model.destroy({
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }
      });
    },
    
    loadMore: function( e ) {
      debug( 'load more news content' );
      e.preventDefault();
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
  
  // Return view definition as module export
  module.exports = TournamentNews;
});

define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:wallCell' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // View definition
  var WallCell = Valkie.ItemView.extend({
    tagName: 'div',
    className: 'post',
    template: Valkie.template( require( 'text!./templates/wallCell.hbs' ) ),
    
    ui: {
      'deleteBtn': 'button.delete'
    },
    
    events: {
      'click @ui.deleteBtn': 'delete'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      this.deletable = false;
      if( options.isAdmin || options.user == this.model.get( 'author._id' ) ) {
        this.deletable = true;
      }
    },
    
    render: function() {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      
      this.$el.html( this.template({
        post: this.model.toJSON(),
        deletable: this.deletable
      }) );
      this.bindUIElements();
      
      this.triggerMethod('render', this);
      return this;
    },
    
    delete: function() {
      debug( 'delete post %s', this.model.id );
      this.model.destroy();
      this.destroy();
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
  module.exports = WallCell;
});
define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:views:header' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var HeaderView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/header.hbs' ) ),
    
    behaviors: {
      'dropdown': {
        selector: '.dropdown-toggle'
      },
    },
    
    ui: {
      'avatar': 'span.user-avatar'
    },
    
    onShow: function() {
      debug( 'load user avatar here' );
      var url = this.model.url() + '/avatar';
      this.ui.avatar.css( 'background-image', "url("+ url +")");
    },

    render: function () {
      this.setElement( this.template({
        teams: this.model.get('teams'),
        leagues: this.model.getLeagues(),
        url: this.model.get('url')
      }) );
      this.bindUIElements();
      return this;
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = HeaderView;
});
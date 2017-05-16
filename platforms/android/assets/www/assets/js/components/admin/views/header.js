define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:admin:views:header' );
  
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
    
    render: function() {
      this.setElement( this.template({
        url: this.options.league.get( 'url' )
      }) );
      this.bindUIElements();
      return this;
    },
    
    onShow: function() {
      debug( 'load user avatar here' );
      var url = 'https://www.somosfut.com/league/' + this.options.league.id + '/avatar';
      this.ui.avatar.css( 'background-image', "url("+ url +")");
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = HeaderView;
});
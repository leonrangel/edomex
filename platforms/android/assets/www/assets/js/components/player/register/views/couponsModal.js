define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:couponsModal' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var CouponsModal = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/couponsModal.hbs' ) ),
    
    behaviors: {
      'modal': {}
    },
    
    ui: {
      'goto': 'a.goto-coupons',
      'removeModal': 'a.dont-show'
    },

    events: {
      'click @ui.goto': 'goToCoupons',
      'click @ui.removeModal': 'removeModal'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    goToCoupons: function (event) {
      this.$el.modal('hide')
    },

    removeModal: function (event) {
      event.preventDefault()
      this.trigger('tours:clear', 'coupons');
      this.$el.modal('hide')
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = CouponsModal;
});
// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.modal' );
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:modal' );
  
  // Behavior definition
  var ModalBehavior = Valkie.Behavior.extend({
    defaults: {
      'backdrop': true,
      'keyboard': false,
      'show'    : false
    },
    
    ui: {
      'closeBtn': '.close'
    },
    
    events: {
      'click @ui.closeBtn': function() {
        debug( 'closing modal' );
        this.$el.modal( 'hide' );
      }
    },
    
    onBeforeShow: function() {
      debug( 'on before show trigger with options: %o', this.options );
      $( document ).off( '.modal.data-api' );
      
      this.$el.modal( this.options );
      this.$el.on( 'hidden.bs.modal', _.bind( function() {
        this.view.trigger( 'modal:closed' );
        this.view.destroy();
      }, this ));
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      this.$el.modal( 'show' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = ModalBehavior;
});

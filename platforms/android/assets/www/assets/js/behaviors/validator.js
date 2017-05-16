// Module definition
define( function( require, exports, module ) {
  'use strict';

  // Module dependencies
  require( 'ui.validator' );
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:validator' );

  // Behavior definition
  var ValidatorBehavior = Valkie.Behavior.extend({
    defaults: {
      successHandler: false,
      autoFocus: true,
      dataPrefix: 'data-validator-',
      msgHolder: 'data-validator-error',
      errorClass: 'validator-error',
      elements: 'input, textarea, select',
      validateOnBlur: true,
      preventSubmit: true,
      additionalExpressions: {},
      errorMessages: {},
      onError: function(){},
      onSuccess: function(){}
    },
    
    behaviors: {
      'tooltip': {
        'selector': '.validator-error',
        'trigger': 'focus',
        'placement': 'right',
        'title': function() {
          return this.dataset.validatorError;
        }
      }
    },
    
    ui: {
      'form': 'form'
    },
    
    onBeforeShow: function() {
      debug( 'on before show trigger with options: %o', this.options );
      
      // Get the validator success handler method if any, it will be
      // called setting it's context back to the view instance
      if (this.ui.form.pixativeFormValidator) {
        this.ui.form.pixativeFormValidator( this.options );
        if( this.options.successHandler ) {
          var cb = this.view[ this.options.successHandler ];
          this.ui.form.on( 'validator.success', _.bind( cb, this.view ) );
        }
      }
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return behavior definition as module export
  module.exports = ValidatorBehavior;
});

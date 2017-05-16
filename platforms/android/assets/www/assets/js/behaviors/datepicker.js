// Module definition
define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  require( 'ui.datepicker' );
  var Valkie = require( 'valkie' );
  var debug  = require( 'debug' )( 'behavior:datepicker' );
  
  // Behavior definition
  var DatepickerBehavior = Valkie.Behavior.extend({
    defaults: {
      selector: '.datepicker',
      autoclose: true,
      calendarWeeks: false,
      clearBtn: false,
      forceParse: true,
      format: 'mm/dd/yyyy',
      language: 'es',
      keyboardNavigation: true,
      minViewMode: 0,
      orientation: 'auto',
      startDate: 'today',
      endDate: '+1y',
      todayHighlight: true,
      weekStart: 1
    },
    
    onShow: function() {
      debug( 'on show trigger with options: %o', this.options );
      
      // Retrieve toggler elements and initiate plugin with provided options
      this.$el
        .find( this.options.selector )
        .datepicker( this.options );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return behavior definition as module export
  module.exports = DatepickerBehavior;
});

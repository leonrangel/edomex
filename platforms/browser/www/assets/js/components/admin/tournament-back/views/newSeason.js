define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newSeason' );
  
  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewSeasonView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newSeason.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'datepicker': {
        selector: '.input-daterange',
        startDate: '-10y',
        endDate: '+1y'
      },
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'      : 'form',
      'range'     : 'input[name="range"]',
      'startDate' : 'input[name="startDate"]',
      'endDate'   : 'input[name="endDate"]'
    },

    events: {
      'change @ui.range' : 'selectRange'
    },

    selectRange: function ( e ) {
      var input = e.target;
      if( input.checked ) {
        this.ui.endDate.show();
        this.ui.startDate.prop('placeholder', 'Fecha de Arranque');
      } else {
        this.ui.endDate.val('');
        this.ui.startDate.prop('placeholder', 'Fecha');
        this.ui.endDate.hide();
      }
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },
    
    submit: function() {
      debug( 'submit form' );

      var startDate = this.ui.startDate.val().trim();
      var endDate = this.ui.endDate.val().trim();

      // Trigger submit with correct endDate
      if ( endDate === '' || startDate === endDate || !this.ui.range.prop('checked') ) {
        this.trigger( 'submit', new Date( startDate ), undefined );
      } else {
        this.trigger( 'submit', new Date( startDate ), new Date( endDate ) );
      }
      
      this.$el.modal( 'hide' );
    },

    onBeforeShow: function() {
      debug( 'about to be shown' );

      if ( this.options.seasons && this.options.seasons.length !== 0 ) {
        var last = this.options.seasons[this.options.seasons.length - 1];
        if ( last.endDate ) {
          this.ui.startDate.datepicker( 'setStartDate', new Date( last.endDate ) );
          this.ui.endDate.datepicker( 'setStartDate', new Date( last.endDate ) );
        } else {
          this.ui.startDate.datepicker( 'setStartDate', new Date( last.startDate ) );
          this.ui.endDate.datepicker( 'setStartDate', new Date( last.startDate ) );
        }
      }

      this.ui.endDate.hide();
    },
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewSeasonView;
});
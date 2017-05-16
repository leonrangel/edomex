define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newMatch' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewMatchView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newMatch.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'tooltip': {},
      'validator': {
        successHandler: 'submit'
      },
      'datepicker': {
        startDate: '-1y',
        endDate: '+1y'
      },
      'differentTeams': {}
    },
    
    ui: {
      'form'    : 'form',
      'date'    : 'input[name="date"]',
      'season'  : 'select[name="season"]',
      'seasons' : 'select[name="season"] option',
      'teamA'   : 'select[name="teamA"]',
      'teamB'   : 'select[name="teamB"]',
      'hour'    : 'select[name="hour"]',
      'minute'  : 'select[name="minute"]'
    },

    events: {
      'change @ui.season' : 'selectSeason'
    },

    selectSeason: function ( e ) {
      var season = $( e.target ).val().split( ';' );
      if ( season.length === 1 ) {
        var startDate = new Date( season[0] );
        this.ui.date.datepicker( 'setStartDate', startDate );
        this.ui.date.datepicker( 'setEndDate', startDate );

        this.ui.date.datepicker( 'update', startDate );
      } else {
        this.ui.date.datepicker( 'setStartDate', new Date(season[0]) );
        this.ui.date.datepicker( 'setEndDate', new Date(season[1]) );

        this.ui.date.datepicker( 'update', '' );
      }

      // Display if dont
      if ( !this.ui.date.closest('.form-section').is(':visible') ) {
        this.ui.date.closest('.form-section').show();
        this.ui.hour.closest('.form-section').show();
      }
    },

    getSeasonOption: function ( date ) {      
      for (var i = 1; i < this.ui.seasons.length; i++) {
        var seasonOption = this.ui.seasons[i];
        var season = $(seasonOption).prop( 'value' ).split( ';' );

        // Only has one day this season
        if ( season.length === 1 ) {
          var startDate = new Date( season[0] );
          if ( startDate.getTime() === date.getTime() ) {
            return seasonOption;
          }
        } else {
          var startDate = new Date( season[0] );
          var endDate = new Date( season[1] );
          if ( startDate <= date && date <= endDate ) {
            return seasonOption;
          }
        }
      }

      return undefined;
    },
    
    render: function() {
      this.setElement( this.template( this.options ) );
      this.bindUIElements();
      return this;
    },
    
    onShow: function() {
      debug( 'displayed' );
      
      // Set model data on edit mode
      if( this.options.edit ) {
        debug( 'unpack model data' );

        var data = this.model.toJSON();
        var date = new Date( data.date );

        this.$( 'option' ).removeAttr( 'selected' );
        this.ui.teamA.val( data.teamA._id );
        this.ui.teamB.val( data.teamB._id );
        this.ui.hour.val( date.getHours() );
        this.ui.minute.val( date.getMinutes() );

        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        var option = this.getSeasonOption( date );        
        option.selected = true;
        
        var dates = option.value.split( ';' );

        // Only has one day this season
        if ( dates.length === 1 ) {

          var startDate = new Date( dates[0] );
          
          this.ui.date.datepicker( 'setStartDate', startDate );
          this.ui.date.datepicker( 'setEndDate', startDate );

          this.ui.date.datepicker( 'update', startDate );

        } else {
          this.ui.date.datepicker( 'setStartDate', new Date( dates[0] ) );
          this.ui.date.datepicker( 'setEndDate', new Date( dates[1] ) );

          this.ui.date.datepicker( 'update', '' );
        }
        
      } else {
        this.ui.date.closest('.form-section').hide();
        this.ui.hour.closest('.form-section').hide();
      }
    },

    submit: function() {
      debug( 'submit form' );

      // Build date to use
      var date = new Date( this.ui.date.val() );
      date.setHours( this.ui.hour.val() );
      date.setMinutes( this.ui.minute.val() );
      
      this.model.set({
        date  : date,
        teamA : this.ui.teamA.val(),
        teamB : this.ui.teamB.val()
      });

      this.trigger( 'submit', this.model );
      this.$el.modal( 'hide' );
    },
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewMatchView;
});

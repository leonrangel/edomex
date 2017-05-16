define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:newMatch' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewMatchView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newMatchFriendly.hbs' ) ),
    
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
      'address'    : 'input[name="address"]',
      'teamA'   : 'select[name="teamA"]',
      'teamB'   : 'select[name="teamB"]',
      'hour'    : 'select[name="hour"]',
      'minute'  : 'select[name="minute"]'
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
        var date = data.date ? new Date(data.date) : new Date();

        this.ui.address.val(data.address);

        this.$( 'option' ).removeAttr( 'selected' );
        if (data.teamA) this.ui.teamA.val( data.teamA._id );
        if (data.teamB) this.ui.teamB.val( data.teamB._id );
        this.ui.hour.val( date.getHours() );
        this.ui.minute.val( date.getMinutes() );

        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        this.ui.date.datepicker( 'update', date );
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
        teamA : this.ui.teamA.val() === '-' ? null : this.ui.teamA.val(),
        teamB : this.ui.teamB.val() === '-' ? null : this.ui.teamB.val(),
        address : this.ui.address.val()
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



define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:extraInfo' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // View definition
  var LeagueExtras = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/extra.hbs' ) ),
    
    behaviors: {
      tooltip: {},
      validator: {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'    : 'form',
      'details' : 'textarea[name="details"]'
    },

    events: {
      'change @ui.details' : 'onChangeData'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    submit: function() {
      debug( 'saving new information' );
      
      var extras  = this.options.league.get( 'extras' );
      extras.info = this.ui.details.val();

      this.options.league.set( 'extras', extras );
      this.options.league.save(null, {
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }
      });
      
      this.trigger( 'data:changed', undefined );
    },

    onChangeData: function() {
      if( this.cleanForm ) {
        var dirtyForm = this.ui.form.serialize();
        if( this.cleanForm !== dirtyForm ) {
          this.trigger( 'data:changed', { view: this } );
        } else {
          this.trigger( 'data:changed', undefined );
        }
      }
    },

    onBeforeShow: function() {
      debug( 'about to be shown' );

      var league = this.options.league.toJSON();
      if( league.extras.info ) {
        this.ui.details.val( league.extras.info );
      }
    },

    onShow: function() {
      debug( 'displayed' );
      this.cleanForm = this.ui.form.serialize();
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = LeagueExtras;
});

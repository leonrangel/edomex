define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:information' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );

  // View definition
  var LeagueContact = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/contact.hbs' ) ),

    behaviors: {
      tooltip: {},
      validator: {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'    : 'form',
      'name'    : 'input[name="name"]',
      'phone'   : 'input[name="phone"]',
      'mobile'  : 'input[name="mobile"]',
      'email'   : 'input[name="email"]',
      'address' : 'input[name="address"]'
    },

    events: {
      'change @ui.name'    : 'onChangeData',
      'change @ui.phone'   : 'onChangeData',
      'change @ui.mobile'  : 'onChangeData',
      'change @ui.email'   : 'onChangeData',
      'change @ui.address' : 'onChangeData'
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    submit: function() {
      debug( 'saving new information' );

      var contact    = this.options.league.get( 'contact' );
      contact.name   = this.ui.name.val();
      contact.phone  = this.ui.phone.val();
      contact.mobile = this.ui.mobile.val();
      contact.email  = this.ui.email.val();

      this.options.league.set({
        'contact' : contact,
        'address' : this.ui.address.val()
      });
      
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
      this.ui.name.val( league.contact.name );
      this.ui.phone.val( league.contact.phone );
      this.ui.mobile.val( league.contact.mobile );
      this.ui.email.val( league.contact.email );
      this.ui.address.val( league.address );
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
  module.exports = LeagueContact;
});

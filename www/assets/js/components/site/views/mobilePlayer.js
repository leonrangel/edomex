define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug  = require( 'debug' )( 'module:site:views:mobileLogin' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var Crypto = require( 'crypto' );

    // AUTOCOMPLETE
  require( 'ui.autocomplete' );
  var $ = require( 'jquery' );

  // View definition
  var MobilePlayerForm = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/mobilePlayer.hbs' ) ),

   

    render: function() {
      this.$el.html( this.template() );
      this.bindUIElements();
      return this;
    },

    onShow: function() {

      
      $('#autocomplete').autocomplete({
          lookup: require( './listLeagues' ),
          onSelect: function (suggestion) {
            location.hash = suggestion.data;
            //window.location.href = suggestion.data ;
          }
        });
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Return view definition as module export
  module.exports = MobilePlayerForm;
});

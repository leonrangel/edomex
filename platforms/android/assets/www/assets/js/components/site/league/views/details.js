define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:details' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var LeagueDetails = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/details.hbs' ) ),

    ui: {
      'nav' : 'img.linktomap',
    },
    
    events: {
      'click @ui.nav' : function(){
        if (device.platform.toUpperCase() === 'ANDROID') {
           navigator.app.loadUrl('https://maps.google.com/maps?saddr='+this.options.league.toJSON().address, { openExternal: true });
        }
        else if (device.platform.toUpperCase() === 'IOS') {
            window.open('https://maps.google.com/maps?saddr='+this.options.league.toJSON().address, '_system');
        }
      },
    },
    
    render: function() {
      debug( 'render' );

      this.setElement( this.template( this.options.league.toJSON() ) );
      this.bindUIElements();
      return this;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LeagueDetails;
});

//<iframe src="{{extras.map}}" width="600" height="600" frameborder="0" style="border:0"></iframe>
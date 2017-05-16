define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:information' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // Set view definition
  var TeamInformation = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/information.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'infobox': 'pre',
      'saveInfo': '#saveInfo'
    },
    
    events: {
      'click @ui.saveInfo' : 'saveInfo'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      this.team = options.team;
      this.isAdmin = options.isAdmin;
    },
    
    render: function() {
      this.setElement( this.template( this.team.toJSON() ) );
      this.bindUIElements();
      return this;
    },
    
    saveInfo: function() {
      debug( 'save new team information provided' );
      var newVal = this.ui.infobox.text();
      if( newVal !== '' && newVal !== this.team.get( 'extras' )['info']  ) {

        var extras  = this.team.get( 'extras' );
        extras.info = newVal;
        this.team.set( 'extras', extras );
        this.team.patch();
      }
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      // Enable admin functionality
      this.ui.saveInfo.hide();
      if( this.isAdmin ) {
        // Make content box editable and display save button
        this.ui.infobox
          .attr( 'contenteditable', true )
          .attr( 'title', 'Click para editar' )
          .addClass( 'hasTip' );
        this.ui.saveInfo.show();
      }
      
      // Get value to show
      var value = '';
      if( ! ( this.team.get( 'extras' )['info'] ) ) {
        value = 'Aún no se ha especificado información para el equipo...';
      } else {
        value = this.team.get( 'extras' )['info'];
      }
      
      // Update UI with info value
      this.ui.infobox.text( value );
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
  module.exports = TeamInformation;
});

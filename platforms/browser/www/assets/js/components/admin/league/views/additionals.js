define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:additionals' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // View definition
  var LeagueAdditionals = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/additionals.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'form'           : 'form',
      'croquis'        : 'input[name="croquis"]',
      'details'        : 'textarea[name="details"]',
      'save'           : 'span.save',
      'displayCroquis' : 'div.display-croquis'
    },
    
    events: {
      'change @ui.croquis' : 'uploadLocation',
      'change @ui.details' : 'onChangeData',
      'click @ui.save'     : 'submit'
    },

    initialize: function() {
      debug( 'initialize with options: %o', this.options );
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.options.league.toJSON() ) );
      this.bindUIElements();
      return this;
    },
    
    uploadLocation: function() {
      debug( 'uploading new location image' );
      var data = new FormData( this.ui.form[0] );
      this.options.league.uploadLocationImage( data, function( res ) {
        if( res ) {
          alert( 'La imagen se ha guardado con exito, puede continuar agregando adicionales.' );

          var croquis = this.options.league.toJSON().extras.croquis;
          this.ui.displayCroquis.css({
            'background-image': 'url(' + croquis[0] + ')'
          });
        }
      }, this );
    },
    
    submit: function() {
      debug( 'saving new information' );

      var extras = this.options.league.get( 'extras' );
      extras.additionals = this.ui.details.val();
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
        this.ui.details.val( league.extras.additionals );
      }

      this.ui.displayCroquis.css({
        display: 'inline-block',
        width: '100px',
        height: '100px',
        backgroundSize: 'cover'
      });
    },
    
    onShow: function() {
      debug( 'shown' );
      this.cleanForm = this.ui.form.serialize();
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LeagueAdditionals;
});

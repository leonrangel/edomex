define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:league:views:information' );

  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );

  // View definition
  var LeagueInformation = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/information.hbs' ) ),

    data: {},
    
    behaviors: {
      tooltip: {},
      validator: {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form'         : 'form',
      'avatar'       : 'input[name="avatar"]',
      'front'        : 'input[name="front"]',
      'name'         : 'input[name="name"]',
      'type'         : 'select[name="type"]',
      'match'        : 'input[name="match"]',
      'inscription'  : 'input[name="inscription"]',
      'url'          : 'input[name="url"]',
      'payment'      : 'input[name="payment"]',
      'map'          : 'input[name="map"]',
      'manage'       : 'input[name="managePayments"]',
      'displayLogo'  : '#display-logo',
      'displayFront' : '#display-front'
    },
    
    events: {
      'change @ui.avatar'      : 'uploadAvatar',
      'change @ui.front'       : 'uploadFrontImage',
      'change @ui.name'        : 'onChangeData',
      'change @ui.type'        : 'onChangeData',
      'change @ui.match'       : 'onChangeData',
      'change @ui.inscription' : 'onChangeData',
      'change @ui.url'         : 'onChangeData',
      'change @ui.payment'     : 'onChangeData',
      'change @ui.manage'      : 'onChangeData',
      'change @ui.map'         : 'onChangeData',
      'blur @ui.url'           : 'validateURL'
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
    
    submit: function() {
      debug( 'saving new information' );

      var extras              = this.options.league.get( 'extras' );
      extras.type             = this.ui.type.val();
      extras.matchPrice       = this.ui.match.val();
      extras.inscriptionPrice = this.ui.inscription.val();
      extras.mercadopago      = this.ui.payment.val();
      extras.map              = this.ui.map.val();
      extras.managePayments   = this.ui.manage.prop( 'checked' );

      this.options.league.set({
        'url'    : this.ui.url.val(),
        'name'   : this.ui.name.val(),
        'extras' : extras
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

    uploadAvatar: function() {
      debug( 'uploading new avatar' );
      var data = new FormData( this.ui.form[0] );
      this.options.league.uploadAvatar( data, function ( ok ) {
        if ( ok ) {
          var leagueId = this.options.league.toJSON()._id;
          this.ui.displayLogo.css('background-image', 'url("https://www.somosfut.com/league/' + leagueId + '/avatar")');
          $('.user-avatar').css('background-image', 'url("https://www.somosfut.com/league/' + leagueId + '/avatar")');
        }
      }, this );
    },

    uploadFrontImage: function() {
      debug( 'uploading new front image' );
      var data = new FormData( this.ui.form[0] );
      this.options.league.uploadFrontImage( data, function ( ok ) {
        if ( ok ) {
          var leagueId = this.options.league.toJSON()._id;
          this.ui.displayFront.css('background-image', 'url("https://www.somosfut.com/league/' + leagueId + '/front")');
        }
      }, this );
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

    validateURL: function() {
      debug( 'check if url is available' );

      // If field is empty stop there
      if( this.ui.url.val() === '' )
        return;

      // Get safe version of the url value
      var test = this.ui.url.val()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();

      // Update field and check availability
      this.ui.url.val( test );
      var check = {
        id  : this.options.league.id,
        url : test
      }
      this.options.league.isAvailable( check, function( available ) {
        this.ui.url
          .removeClass( 'validator-error' )
          .removeAttr( 'data-validator-error' );

        if( ! available ) {
          this.ui.url
            .addClass( 'validator-error' )
            .attr( 'data-validator-error', 'URL no disponible' );
        }
      }, this );
    },

    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      var league = this.options.league.toJSON();
      this.ui.url.val( league.url );
      this.ui.name.val( league.name );
      this.ui.type.val( league.extras.type );
      this.ui.match.val( league.extras.matchPrice );
      this.ui.inscription.val( league.extras.inscriptionPrice );
      this.ui.payment.val( league.extras.mercadopago );
      this.ui.map.val( league.extras.map );
      this.ui.manage.prop( 'checked', league.extras.managePayments );

      // FIX: this must be in css
      this.ui.displayLogo.css({
        borderRadius: '2px',
        backgroundSize: 'cover',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        width: '82px',
        height: '82px',
        border: '4px solid #FFF'
      });
      this.ui.displayFront.css({
        borderRadius: '2px',
        backgroundSize: 'cover',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        height: '82px',
        border: '4px solid #FFF'
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
  module.exports = LeagueInformation;
});

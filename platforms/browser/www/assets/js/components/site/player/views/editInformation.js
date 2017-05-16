define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:player:views:editInformation' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // View definition
  var PlayerInformation = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/editInformation.hbs' ) ),

    behaviors: {
      'tooltip': {},
      'validator': {
        successHandler: 'saveChanges'
      }
    },

    ui: {
      'form': 'form',
      'saveChanges': '#saveChanges',
      'name'           : 'input[name="info[name]"]',
      'lastnameFather' :'input[name="info[lastnameFather]"]',
      'lastnameMother' : 'input[name="info[lastnameMother]"]',
      'gender'         : 'select[name="info[gender]"]',
      'position'       : 'select[name="info[position]"]',
      'birthday'       : 'select[name="birth[day]"]',
      'birthmonth'     : 'select[name="birth[month]"]',
      'birthyear'      : 'select[name="birth[year]"]',
      'profile'        : 'select[name="info[profile]"]',
      'country'        : 'select[name="info[country]"]',
      'stature'        : 'input[name="info[stature]"]',
      'weigth'         : 'input[name="info[weigth]"]',
      'number'         : 'input[name="info[number]"]',
      'nickname'       : 'input[name="info[nickname]"]'
    },

    events: {
      'click @ui.saveChanges': 'saveChanges',
    },

    initialize: function( options ) {
      debug( 'initializing with options: %o', options );
      this.player  = options.player;
      this.user    = options.user;
    },

    saveChanges: function ( e ) {
      e.preventDefault();

      // Save changes of header
      if ( !this.options.header.saveChanges() ) {
        return;
      }

      // Don't do anything if url is not available
      if( this.$( 'input' ).hasClass( 'validator-error' ) ||
          this.$( 'select' ).hasClass( 'validator-error' ) ) {
        return;
      }

      // Get birthday string
      var date = this.ui.birthday.val();
      date += '-' + this.ui.birthmonth.val();
      date += '-' + this.ui.birthyear.val();
      
      // Get  user info
      var data = {
        name : this.ui.name.val(),
        lastnameFather : this.ui.lastnameFather.val(),
        lastnameMother : this.ui.lastnameMother.val(),
        info : {
          gender    : this.ui.gender.val(),
          stature   : this.ui.stature.val(),
          position  : this.ui.position.val(),
          country   : this.ui.country.val(),
          profile   : this.ui.profile.val(),
          weigth    : this.ui.weigth.val(),
          number    : this.ui.number.val(),
          nickname  : this.ui.nickname.val(),
          birthday  : new Date( date )
        },
        extras: {
          filled: true
        }
      };

      var self = this;
      
      // Set model changes and save it
      this.user.save( data, {
        patch: true,
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success: function ( user ) {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
          var title = user.get( 'name' ) + ' ' + user.get( 'lastnameFather' );
          $('.title h1').html( title );

          var profileUrl = '#jugador/' + user.get( 'url' );
          
          window.location.hash = profileUrl;
          $('.profile-url').attr( 'href', profileUrl );
        }
      } );
    },
    
    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.player.toJSON() ) );
      this.bindUIElements();
      return this;
    },

    parseBirth: function ( birthStr ) {
      var birth = new Date( birthStr );

      var day = '' + birth.getDate();
      day = day.length === 2 ? day : '0' + day;

      var monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov','Dec'
      ];
      var month = monthNames[birth.getMonth()];

      var year = '' + birth.getFullYear();

      return [day, month, year];
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      // Set the values
      var player = this.player.toJSON();
      this.ui.gender.val( player.info.gender );
      this.ui.position.val( player.info.position );
      this.ui.profile.val( player.info.profile );
      this.ui.country.val( player.info.country );

      var birth = this.parseBirth( player.info.birthday );
      this.ui.birthday.val( birth[0] );
      this.ui.birthmonth.val( birth[1] );
      this.ui.birthyear.val( birth[2] );
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
  module.exports = PlayerInformation;
});

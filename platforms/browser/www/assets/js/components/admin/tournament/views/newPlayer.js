define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:register:views:newTeam' );
  
  // Module dependencies
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  var $  = require( 'jquery' ); // -M
  var Crypto = require( 'crypto' ); 

  var mediator = require( 'mediator' ); // -M
  
  // View definition
  var NewTeamView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newPlayer.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'tooltip': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    ui: {
      'form' : 'form',
      'name' : 'input[name=name]',
      lastnameFather   : 'input[name=lastnameFather]',
      lastnameMother   : 'input[name=lastnameMother]',
      email            : 'input[name=email]',
      mobile           : 'input[name=mobile]',
      teams : '#selteam',
      extrasage : 'input[name=age]',
      // extrasife : 'input[name=ife]',
      extrasaddress : 'input[name=address]',
      infonumber   : 'input[name=number]',
      infoposition : 'input[name=position]',
      'submit' : 'input[name=submit-player]'  
    },


    initialize: function (options) {
      //this.user = options.user;
      //console.log('dentro newplayer');
    },
    
    render: function() {
      //console.log('render');
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    onBeforeShow: function () {
      debug('on before show');

      // teams list
      var tname = this.options.tournament.get('name');
      
      var self = this;
      $.get('https://www.somosfut.com/league/'+mediator.user.get('leagues')[0]+'/teams', function(d){
        if (d && d.length){
          var html = '';
          d.sort(function(a,b){return a.name.localeCompare(b.name); });
          d.forEach(function(i){
            if (tname === i.url)
              html += '<option value="'+i.id+'">'+i.name+'</option>';
          });

          var sel = $('#selteam', this.$el).html(html);
          
        } 
      });
      
      //$

    },
    
    submit: function() {
      debug( 'submit form with name: %s', this.ui.name.val() );
      
      var data = {
        name: this.ui.name.val(),
        password : Crypto.SHA512( 'event.stopPropagation();' ).toString(),
        lastnameFather   : this.ui.lastnameFather.val(),
        lastnameMother   : this.ui.lastnameMother.val(),
        email            : this.ui.email.val(),
        mobile           : this.ui.mobile.val(),
        teams : [this.ui.teams.val()],
        leagues : [],
        extras : {
          age : this.ui.extrasage.val(),
          ife : '',
          address : this.ui.extrasaddress.val()
        },
        info : {
          number   : this.ui.infonumber.val(),
          position : this.ui.infoposition.val()
        }
      };
      
      this.trigger( 'submit', data, this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewTeamView;
});
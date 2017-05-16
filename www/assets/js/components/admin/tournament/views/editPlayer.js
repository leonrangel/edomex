define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:register:views:newTeam' );
  
  // Module dependencies
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  var $  = require( 'jquery' ); // -M
  var Crypto = require( 'crypto' ); 

  var utils    = require( 'helpers/utils' );

  var mediator = require( 'mediator' ); // -M
  
  // View definition
  var NewTeamView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/editPlayer.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'tooltip': {}
    },
    
    ui: {
      'form' : 'form',
      'name' : 'input[name=name]',
      lastnameFather   : 'input[name=lastnameFather]',
      lastnameMother   : 'input[name=lastnameMother]',
      email            : 'input[name=email]',
      mobile           : 'input[name=mobile]',
      extrasage : 'input[name=age]',
      extrasife : 'input[name=ife]',
      'extrasifeDisplay': '#display-ife',
      extrasaddress : 'input[name=address]',
      infonumber   : 'input[name=number]',
      infoposition : 'input[name=position]',

      'avatar': 'input[name="avatar"]',
      'avatarDisplay': '#display-avatar',
      'saveChanges'    : '#saveChanges',

      'deletePlayer'      : '#deletePlayer'
    },

    events : {
      'click @ui.saveChanges'    : 'saveChanges',
      'change @ui.extrasife' : 'ifeUpload',
      'change @ui.avatar' : 'avatarUpload',
      'click @ui.deletePlayer' : 'deletePlayer',
    },


    initialize: function (options) {
      //this.user = options.user;
      this.model = options.player;
    },
    
    render: function() {
      this.setElement( this.template( this.model.toJSON() ) );
      this.bindUIElements();
      return this;
    },

    onBeforeShow: function () {
      debug('on before show');

      // teams list
      var self = this;
      $.get('/league/'+mediator.user.get('leagues')[0]+'/teams', function(d){
        if (d && d.length){
          var html = '';
          d.sort(function(a,b){return a.name.localeCompare(b.name); });
          d.forEach(function(i){
            html += '<option value="'+i.id+'">'+i.name+' ('+i.url+')'+'</option>';
          });

          var sel = $('#selteam', this.$el).html(html);
          
        } 
      });
      
      //$

    },

    deletePlayer : function(e){
      e.stopPropagation();
      e.preventDefault();
      //console.log('this.team.toJSON()',this.team.toJSON());
      var self = this;
      this.model.destroy({
        success: function() {
          utils.message( 'success', 'Exito', 'USER_DELETED' );
          self.trigger( 'viewend',{}, self );
        }
      }, this);
    },

    avatarUpload: function() {
      debug( 'uploading new avatar' );
      
      var data = new FormData( this.ui.form[0] );
      this.model.uploadAvatar( data, function( ok ) {
        if( ok ) {
          this.trigger( 'modal:closed', this );
        }
        this.trigger( 'viewend',{}, this );
      }, this );
    },

    ifeUpload: function() {
      debug( 'uploading new avatar' );
      
      var data = new FormData( this.ui.form[0] );
      this.model.uploadIFE( data, function( ok ) {
        if( ok ) {
          this.trigger( 'modal:closed', this );
        }
        this.trigger( 'viewend',{}, this );
      }, this );
    },

    saveChanges : function(e){
      e.preventDefault();

      // Set values and patch if required
      this.model.set({
        name: this.ui.name.val(),
        lastnameFather   : this.ui.lastnameFather.val(),
        lastnameMother   : this.ui.lastnameMother.val(),
        email            : this.ui.email.val(),
        mobile           : this.ui.mobile.val(),
        extras : {
          age : this.ui.extrasage.val(),
          ife : this.ui.extrasife.val(),
          address : this.ui.extrasaddress.val()
        },
        info : {
          number   : this.ui.infonumber.val(),
          position : this.ui.infoposition.val()
        }
      });

      if( this.model.changedAttributes() ) {
        this.model.patch();
      }
      this.trigger( 'viewend',{}, this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewTeamView;
});
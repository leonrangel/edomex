define( function( require, exports, module ) {
  'use strict';

  // mixpanel.track('Team', {
  //                 action : 'edit',
  //                 success : 'ok',
  //                 elementId : team.get('_id'),
  //                 elementName : team.get('name')
  //               });

  // mixpanel.track('Team', {
  //                 action : 'delete',
  //                 success : 'ok',
  //                 elementId : team.get('_id'),
  //                 elementName : team.get('name')
  //               });

  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:header' );

  // Module dependencies
  var $ = require( 'jquery' );
  var Valkie = require( 'valkie' );

  var utils    = require( 'helpers/utils' );

  // View definition
  var TeamHeader = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/editTeam.hbs' ) ),

    behaviors: {
      'modal': {},
      'tooltip': {}
    },

    ui: {
      'form'           : 'form',
      'frontChooser'   : 'input[name="front"]',
      'avatarChooser'  : 'input[name="avatar"]',
      'frontImage'     : '#display-front',
      'avatar'         : '#display-avatar',
      'name'           : 'input[name="name"]',
      'url'            : 'input[name="url"]',
      'saveChanges'    : 'button#saveChanges',
      'deleteTeam'      : '#deleteTeam'
    },

    events: {
      'click @ui.saveChanges'    : 'saveChanges',
      'change @ui.frontChooser'  : 'uploadFront',
      'change @ui.avatarChooser' : 'uploadAvatar',
      'click @ui.deleteTeam' : 'deleteTeam',

      'blur @ui.name'  : 'validateURL',
      'blur @ui.url'   : 'validateURL'
    },

    initialize: function( options ) {
      debug( 'initializing' );
      this.token = options.token;
      this.team = options.team;
      this.isAdmin = options.isAdmin;

      if (options.groups){
        this.groups = options.groups.split(',').map(function(d){
          return d.trim();
        });

        this.groups.sort(function(a,b){return a.localeCompare(b); });
      }else{
        this.groups = [];
      }

    },

    render: function() {
      debug( 'render' );
      this.setElement( this.template( this.team.toJSON() ) );
      this.bindUIElements();
      return this;
    },

    deleteTeam : function(e){
      e.stopPropagation();
      e.preventDefault();
      //console.log('this.team.toJSON()',this.team.toJSON());
      this.team.leaveTournament( this.token, function( error, tournament ){
        if( !error ) {   
          utils.message( 'success', 'Exito', 'Equipo eliminado' );
        } else {
          //console.log('errorrtest');
          //utils.message( 'error', 'ERROR', error.desc );
        }
        //this.trigger( 'modal:closed', this );
        this.trigger( 'viewend',{}, this );
      }, this );
    },

    uploadAvatar: function() {
      debug( 'upload new avatar' );

      var data = new FormData( this.ui.form[0] );
      var url  = 'url( "/team/' + this.team.id + '/avatar" )';
      this.team.uploadAvatar( data, function( ok ) {
        if( ok ) {
          this.trigger( 'modal:closed', this );
        }
        this.trigger( 'viewend',{}, this );
      }, this );

    },

    uploadFront: function() {
      debug( 'upload new front image' );

      var data = new FormData( this.ui.form[0] );
      var url  = 'url( "/team/' + this.team.id + '/front" )';
      this.team.uploadFrontImage( data, function( ok ) {
        if( ok ) {
          this.trigger( 'modal:closed', this );
        }
        this.trigger( 'viewend',{}, this );
      }, this );
      
    },

    validateURL: function() {
      debug( 'validate if URL is available' );

      // Get safe version of the url value
      var test = this.ui.url.text()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
      this.ui.url.text( test );

      // Check availability
      var data = { id: this.team.id, url: test };
      this.team.isAvailable( data, function( available ) {
        this.ui.url
          .removeClass( 'validator-error' )
          .attr( 'title', 'Click para editar' )

        if( ! available ) {
          this.ui.url
            .addClass( 'validator-error' )
            .attr( 'title', 'URL no disponible' );
        }
      }, this );
    },

    saveChanges: function( e ) {
      debug( 'save changes to the team details' );
      e.preventDefault();

      // Don't do anything if url is not available
      if( this.ui.url.hasClass( 'validator-error' ) ) {
        return;
      }

      // Set values and patch if required
      this.team.set({
        name : this.ui.name.val(),
        url  : this.ui.url.val(),
        admins : $('#selCap').val() === 'vacio' ? [] : [$('#selCap').val()] 
      });
      if( this.team.changedAttributes() ) {
        this.team.patch();
      }

      // grupo
      var tid = this.team.get('_id');
      var participants = this.options.tournament.get('participants').map(function(d){
        if (d.team){
          if(d.team._id === tid){
            d.group = $('#selGpo').val();
          }
        }

        return d;
      });

      

      this.options.tournament.set({
        participants : participants,
      });
      this.options.tournament.save(null, {
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }
      });      


      this.trigger( 'viewend',{}, this );
    },

    onBeforeShow: function() {
      debug( 'about to be shown' );

      // teams list
      var self = this;
      var admins = this.team.get('admins');
      
      if (admins.length){
        var compare = admins[0];
      }else{
        var compare = '';
      }
      $.get('https://www.somosfut.com/team/'+this.team.get('_id')+'/members', function(d){
        //console.log('d',d,compare);
        var html = '<option value="vacio">Sin capitán</option>';
        if (d && d.length){
          
          d.sort(function(a,b){return a.name.localeCompare(b.name); });
          d.forEach(function(i){
            
            html += '<option value="'+i._id+'" '+(compare===i._id ? 'selected' : '')+'>'+i.name+' '+i.lastnameFather+'</option>';
            
          });

          
          
        } 
        $('#selCap', this.$el).html(html);


      });

      // groups
      if (this.groups.length){
        var tid = this.team.get('_id');
        var compare = '';
        var participants = this.options.tournament.get('participants').forEach(function(d){
          if (d.team){
            if(d.team._id === tid){
              compare = d.group;
            }
          }

        });



        var html = '<option value="">Sin grupo</option>' + this.groups.map(function(d){
          return '<option value="'+d+'" '+(compare===d ? 'selected' : '')+'>'+d+'</option>';
        }).join('');
        $('#selGpo', this.$el).html(html).parent().parent().show();
      }


      
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
  module.exports = TeamHeader;
});

define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:details' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // View definition
  var TournamentDetails = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/details.hbs' ) ),
    
    behaviors: {
      datepicker: {
        selector: '.input-daterange'
      },
      validator: {
        successHandler: 'submit'
      }
    },
    
    ui: {
      form        : 'form',
      name        : 'input[name="name"]',
      startDate   : 'input[name="startDate"]',
      endDate     : 'input[name="endDate"]',
      avatar      : 'input[name="avatar"]',
      displayLogo : '#display-logo',

      noteams     : 'input[name="noteams"]',
      namegpos     : 'input[name="namegpos"]'
    },
    
    events: {
      'change @ui.avatar' : 'uploadAvatar'
    },
    
    submit: function() {
      debug( 'saving provided details' );
      
      

      var tmp = this.options.item.toJSON();

      if (tmp.participants.filter(function(d){  return d.team  }).length > this.ui.noteams.val()){
        
        return;
      }



      if (tmp.participants.length < this.ui.noteams.val()){
        var paramSt = tmp.participants.length ? tmp.participants[0].token : '000-000';
        var nbucs = this.ui.noteams.val() - tmp.participants.length;
        for (var i = 0; i < nbucs ; i++) {
          tmp.participants.push({ team : null, token : paramSt + '-' + i});
        }
      }

      if (tmp.participants.length > this.ui.noteams.val()){
        tmp.participants.sort(function(a,b){
          if (a.team && b.team){
            return a.team.name.localeCompare(b.team.name);
          }

          if (a.team && !b.team){
            return -1;
          }

          if (!a.team && b.team){
            return 1;
          }

          return 1;
            
        });

        tmp.participants =  tmp.participants.slice(0, this.ui.noteams.val());

      }

      //tmp.participants  noteams

      //console.log('tmp.participants',tmp.participants);

      this.options.item.set({
        name      : this.ui.name.val(),
        startDate : new Date( this.ui.startDate.val() ),
        endDate   : new Date( this.ui.endDate.val() ),
        participants : tmp.participants,
        groups : this.ui.namegpos.val()
      });
      this.options.item.save(null, {
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
          // mixpanel.track('Tournament', {
          //   action : 'edit',
          //   success : 'error',
          //   elementId : tmp._id,
          //   elementName : tmp.name
          // });
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
          // mixpanel.track('Tournament', {
          //   action : 'edit',
          //   success : 'ok',
          //   elementId : tmp._id,
          //   elementName : tmp.name
          // });
        }
      });      
    },
    
    uploadAvatar: function() {
      debug( 'uploading new avatar' );
      
      var data = new FormData( this.ui.form[0] );
      this.options.item.uploadAvatar( data, function ( ok ) {
        if ( ok ) {
          var id = this.options.item.get( '_id' );
          this.ui.displayLogo.css({
            'background-image': 'url("/tournament/' + id + '/avatar")'
          });
          $('.league-a-tournamet-extract .image').css({
            'background-image': 'url("/tournament/' + id + '/avatar")'
          });
        }
      }, this );
    },
    
    render: function() {
      debug( 'render view content' );
      
      
      var tournament = this.options.item.toJSON();
      tournament.countTeams = tournament.participants.length;
      tournament.minTeams = tournament.participants.filter(function(d){  return d.team  }).length;
      this.setElement( this.template( tournament ) );
      this.bindUIElements();
      return this;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      var tournament = this.options.item.toJSON();

      this.ui.name.val( tournament.name );
      this.ui.startDate.datepicker( 'setDate', new Date( tournament.startDate ) );
      this.ui.endDate.datepicker( 'setDate', new Date( tournament.endDate ) );

      // FIX: this must be in css
      this.ui.displayLogo.css({
        borderRadius: '2px',
        backgroundSize: 'cover',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        width: '82px',
        height: '82px',
        border: '4px solid #FFF'
      });
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
  module.exports = TournamentDetails;
});

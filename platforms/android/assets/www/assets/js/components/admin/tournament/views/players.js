define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:players' );
  var utils    = require( 'helpers/utils' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );

  var $ = require('jquery');

  // Views -M
  var NewPlayerForm      = require( './newPlayer' );
  var EditPlayerForm      = require( './editPlayer' );
  
  // Models -M
  var TeamPlayer   = require( 'models/user' );

  // View definition
  var TournamentPlayers = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/players.hbs' ) ),
    
    ui: {
      'create'   : 'button.create',
      'edit'   : 'button.edit'
    },
    
    events: {
      'click @ui.create'  : 'newPlayer',
      'click @ui.edit'  : 'editPlayer'
    },

    newPlayer : function(){
      
      var self = this;
      // Create new team instance
      var player = new TeamPlayer();
      player.set({
        verified : 1,
        type      : 'player'
      });

      var regNewPlayer = new NewPlayerForm({
        tournament : this.options.tournament
      });
      regNewPlayer.on({
        'submit': function( data, view ) {

          player
            .set( data )
            .save()
            .done( function( response, status ) {
              //console.log('response, status',response, status,'#team/home/' + team.id);
              if( status === 'success' ) {
                
                view.$el.modal( 'hide' );
                utils.message( 'success', 'Exito', 'ACCOUNT_REGISTERED' );
                self.trigger( 'reset' );

                // mixpanel.track('Player', {
                //   action : 'new',
                //   success : 'ok',
                //   elementId : player.get('_id'),
                //   elementName : player.get('name')
                // });

                return;
              } else {
                // Display error
                utils.message( 'error', 'Error', response.desc );
                // mixpanel.track('Player', {
                //   action : 'new',
                //   success : 'error',
                //   elementId : player.get('_id'),
                //   elementName : player.get('name')
                // });
              }
          });
        }
      }, this );
      
      this.trigger( 'show:modal', regNewPlayer );

    },

    editPlayer : function(e){  
        
      var player = new TeamPlayer();
      player.set( '_id', e.target.getAttribute('data-ids') );
      player.fetch({
        context: this,
        error: function( model, req ) {
          var error = req.responseJSON;
          utils.message( 'error', 'Error', error.desc );
        }
      }).done( function() {
    
        // Listen for changes
        player.on( 'change', function(){
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
          // mixpanel.track('Player', {
          //   action : 'edit',
          //   success : 'ok',
          //   elementId : player.get('_id'),
          //   elementName : player.get('name')
          // });
        });
        
        // Update layout content
        var regEditPlayer = new EditPlayerForm({
          player    : player
        });

        regEditPlayer.on('viewend' , function(data, view){
          view.$el.modal( 'hide' );
          this.trigger( 'reset' );
        }, this);

        this.trigger( 'show:modal', regEditPlayer );

      });
    },

    render: function() {
      this.setElement( this.template({
        players: this.options.players.toJSON()
      }) );
      this.bindUIElements();
      return this;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      var list = {};
      var elms = '<option value="all">Equipo</option>';
      this.options.tournament.toJSON().participants.forEach(function(d){
        if (d.team) {
          list[d.team.name] = 1;
        }
      });
      for (var i in list){
        elms += '<option value="'+i+'">'+i+'</option>';
      }

      $('.primary-table th:eq(1)', this.$el)
        .append($('<select style="margin-left : 3px;height: 24px; padding: 5px 20px 5px 8px; font-size: 10px;">'+elms+'</select>').change(function(){
          var filt = this.value;
          var $this;
          $('.primary-table tbody > tr', this.$el).each(function(d){
            $this = $(this);
            if (filt === 'all'){
              $this.show();
            }else {
              console.log($this.find('td:eq(1)').text().trim(), filt);
              if ($this.find('td:eq(1)').text().trim() != filt){
                $this.hide();
              }else{
                $this.show();
              }
            }
          });

        }));
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
  module.exports = TournamentPlayers;
});
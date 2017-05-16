define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:teams' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var mediator = require( 'mediator' ); // -M

  var utils    = require( 'helpers/utils' ); // -M

  // Views -M
  var NewTeamForm      = require( './newTeam' );
  var EditTeamForm      = require( './editTeam' );

  // Models -M
  var TeamModel   = require( 'models/team' );
  
  // View definition
  var TournamentTeams = Valkie.View.extend({
    //template: Valkie.template( require( 'text!./templates/teams.hbs' ) ),
    
    template: function(data) {
      
      var team;
      for (var i = 0; i<data.participants.length; i++){
        team = data.participants[i].team;
        if (team){
          if (team.admins.length === 0){
            team.noName = true;
            continue;
          }
          team.noName = (team.admins[0]._id === mediator.user.id) ? true : false;
        }
      }

      data.participants.sort(function(a,b){
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

      return Valkie.template( require( 'text!./templates/teams.hbs' ) )(data);
        
    },

    behaviors: {
      tooltip: {}
    },
    
    ui: {
      'create'   : 'button.create',
      'edit'   : 'button.edit',
      'players' : 'button.sellayers'
    },
    
    events: {
      'click @ui.create'  : 'newTeamfn',
      'click @ui.edit'  : 'editTeam'
      //'click @ui.players'  : 'selPlayers'
    },

    initialize: function( options ) {
      this.item = options.item;  // -M
      this.user   = mediator.user;
    },

    selPlayers : function(e){
//       var teamId = e.target.getAttribute('data-ids');

//       $.get('/team/'+this.team.get('_id')+'/members', function(d){      
//         $.get('/team/'+this.team.get('_id')+'/members', function(d){


//           var html = '<option value="vacio">Sin capitán</option>';
//           if (d && d.length){
            
//             d.sort(function(a,b){return a.name.localeCompare(b.name); });
//             d.forEach(function(i){
              
//               html += '<option value="'+i._id+'" '+(compare===i._id ? 'selected' : '')+'>'+i.name+' '+i.lastnameFather+'</option>';
              
//             });

            
            
//           } 


//           http://banca.somosfut.com/tournament/57f9e02eee9359363dbc38c8/players
//           $('#selCap', this.$el).html(html);
//         });
//       });



// <select>
//   <optgroup label="Ya en el equipo">
//     <option>Option 1.1</option>
//   </optgroup> 
//   <optgroup label="Disponibles">
//     <option>Option 2.1</option>
//     <option>Option 2.2</option>
//   </optgroup>
// </select>



    },

    editTeam : function(e){

      var slots = this.options.item.toJSON()['0'].participants; //this.item.get('participants');
      
      

      var team = new TeamModel();
      team.set( '_id', e.target.getAttribute('data-ids') );
      team.fetch({
        context: this,
        error: function( model, req ) {
          var error = req.responseJSON;
          utils.message( 'error', 'Error', error.desc );
        }
      }).done( function() {
    
        // Listen for changes
        team.on( 'change', function(){
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
         
        });
        

        // token
        var token = '';
        //console.log('team',team,team.get('_id'), team.toJSON(),slots);
        var id = team.get('_id');
        for (var i in slots){
          if (slots[i].team){
            //console.log('this token',slots[i].team._id, id);
            if (slots[i].team._id === id){
              token = slots[i].token;
               break;
            }
          }
        }
        // Update layout content
        var regEditTeam = new EditTeamForm({
          token : token,
          team    : team,
          isAdmin : true,
          tournament : this.options.tournament,
          groups : this.options.tournament.get('groups')
        });

        regEditTeam.on('viewend' , function(data, view){
          view.$el.modal( 'hide' );
          this.trigger( 'reset' );
        }, this);

        this.trigger( 'show:modal', regEditTeam );

      });


    },

    newTeamfn : function(){

      // CHECK SLOTS -M      
      var slots = this.options.item.toJSON()['0'].participants; //this.item.get('participants');

      var token = '';
      for (var i in slots){
        if (!slots[i].team){
          token = slots[i].token;
          break
        }
      }

      if (!token){
        utils.message( 'error', 'Error', 'El torneo está completo.' );
        return;
      }

      var self = this;
      // Create new team instance
      var team = new TeamModel();
      team.set({
        admins : [this.user.id],
        token  : utils.makeToken( 2, 4 )
        //tournaments : [this.item.id] // -M
      });
      
      // Create form and display it as a modal
      var user = this.user;
      var regNewTeam = new NewTeamForm({
        model : team,
        user  : mediator.user,
        slots : slots
      });
      regNewTeam.on({
        'fromSel' : function(data, view){
          team.set({ _id : data});
          team.joinTournament( token, function( error, tournament ){
            if( !error ) {   
              utils.message( 'success', 'Exito', 'TEAM_REGISTERED' );
            } else {
              //console.log('errorrtest');
              utils.message( 'error', 'ERROR', error.desc );
            }
            view.$el.modal( 'hide' );
            self.trigger( 'reset' );
          }, this );

        },
        'modal:closed': function() {
          //this._resetURL( '_' );
        },
        'submit': function( data, view ) {
          // Set the provided name and store the team record
          //console.log('sumit');
          team
            .set( data )
            .save()
            .done( function( response, status ) {
              //console.log('response, status',response, status,'#team/home/' + team.id);
              if( status === 'success' ) {
                debug( 'team saved with id: %s', team.id );
                
                // ADD TOURNAMENT -M
                team.joinTournament( token, function( error, tournament ){
                  view.$el.modal( 'hide' );
                  utils.message( 'success', 'Exito', 'TEAM_REGISTERED' );

                  self.trigger( 'reset' );
    
                  if( !error ) {
                   // NOOP
                  } else {
                    utils.message( 'error', 'ERROR', error.desc );
                  }
                }, this );

               

                return;
              }
              else {
                // Display error
                utils.message( 'error', 'Error', response.desc );
               
              }
          });
        }
      }, this );
      
      this.trigger( 'show:modal', regNewTeam );
      //this.layout.modalRegion.show( registerForm );

    },

    render: function() {
      var tmpt = this.options.item.toJSON()['0'];
      if (this.options.tournament.get('groups')){
        tmpt.useGpo = true;
      }
      this.setElement( this.template( tmpt ) );
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
  module.exports = TournamentTeams;
});
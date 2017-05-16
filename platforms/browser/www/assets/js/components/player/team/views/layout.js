define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:layout' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var utils  = require( 'helpers/utils' );
  
  // Models
  var PostModel         = require( 'models/post' );
  var UsersCollection   = require( 'models/users' );
  var PostsCollection   = require( 'models/posts' );
  var MatchesCollection = require( 'models/matches' );

  // Child views
  var TeamHeader      = require( './header' );
  var TeamWall        = require( './wall' );
  var TeamMembers     = require( './members' );
  var TeamMatches     = require( './matches' );
  var TeamTournaments = require( './tournaments' );
  var TeamInformation = require( './information' );
  var InvitePlayer    = require( './invitePlayer' );
  var JoinTournament  = require( './joinTournament' );
  
  // Layout definition
  var TeamLayout = Valkie.LayoutView.extend({
    template: Valkie.template( require( 'text!./templates/layout.hbs' ) ),
    
    regions: {
      'modalRegion'   : '#teamModal',
      'headerRegion'  : '#teamHeader',
      'contentRegion' : '#teamContent'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      
      // Initialize required data
      this.data = {
        isAdmin : options.isAdmin,
        team    : options.team,
        user    : options.user,
        posts   : new PostsCollection(),
        players : new UsersCollection(),
        matches : new MatchesCollection()
      };
      this.data.posts.url   = 'https://www.somosfut.com/team/' + options.team.id + '/posts';
      this.data.players.url = 'https://www.somosfut.com/team/' + options.team.id + '/members';
      this.data.matches.url = 'https://www.somosfut.com/team/' + options.team.id + '/matches';
      
      // Initialize child views, it will be displayed 'onBeforeShow'
      this.header = new TeamHeader({
        team    : this.data.team,
        isAdmin : this.data.isAdmin
      });
      this.header.on( 'show:area', this.loadSection, this );
    },

    loadSection: function( section, prevSection ) {
      debug( 'load content subview for section: %s', section );
      switch( section ) {
        case 'wall':
          this.data.posts.fetch();

          var wall  = new TeamWall({
            collection: this.data.posts,
            isAdmin: this.data.isAdmin,
            user: this.data.user.id
          });
          wall.on( 'save:post', function( content ) {
            // Set post details
            var details = {
              team: this.data.team.id,
              author: this.data.user.id,
              content: content,
              type: 'message'
            };

            // Save post for the team and if ok add it to the collection
            this.data.team.savePost( details, function( post ) {
              if( post ) {
                this.data.posts.add( new PostModel( post ), { at:0 });
              }
            }, this );
          }, this );
          this.contentRegion.show( wall );
          break;
        case 'matches':
          this.data.matches.fetch({ async: false });
          this.contentRegion.show( new TeamMatches({
            collection: this.data.matches
          }) );
          break;
        case 'statistics':
          this.data.team.getTournaments( function( data ) {
            if( data ) {
              this.contentRegion.show( new TeamTournaments({ data: data }) );
            }
          }, this );
          break;
        case 'members':
          this.data.players.fetch();

          var members = new TeamMembers({
            collection: this.data.players,
            isAdmin: this.data.isAdmin
          });
          members.on( 'modal:invite', this.inviteModal, this );
          this.contentRegion.show( members );
          break;
        case 'info':
          var info = new TeamInformation({
            team: this.data.team,
            isAdmin: this.data.isAdmin
          });
          this.contentRegion.show( info );
          break;
        case 'joinTournament':
          var form = new JoinTournament({ team : this.data.team });
          form.on({
            'modal:closed': function() {
              // Activating the previous section
              var navBar = this.header.ui.nav.parent().parent();
              navBar.find('li.active').removeClass( 'active' );
              navBar.find("a[href=" + prevSection + "]").parent().addClass('active');
            },
            'submit': function( token, view ) {
              debug( 'join tournament using token: %s', token );
              this.data.team.joinTournament( token, function( error, tournament ){
                if( !error ) {
                  utils.message( 'success', 'OK', 'TOURNAMENT_JOINED' );

                  // Hide the modal
                  view.$el.modal( 'hide' );

                  // Verify team info complete
                  this.verifyTeamComplete(prevSection);
                } else {
                  utils.message( 'error', 'ERROR', error.desc );
                }
              }, this );
            }
          }, this );
          this.modalRegion.show( form );
          break;
      }
    },
    
    inviteModal: function() {
      debug( 'show invite to team modal' );
      
      var inviteForm = new InvitePlayer({
        team : this.data.team
      });

      inviteForm.on( 'submit', function( email ) {
        this.data.team.sendInvitation( email );
        utils.message( 'success', 'OK', 'INVITATION_SEND' );
      }, this );
      inviteForm.on({
        'tours:clear': function (tourName) {
          this.data.team.clearTours(tourName);
        }
      }, this);
      this.modalRegion.show( inviteForm );
    },

    verifyTeamComplete: function (prevSection) {

      // This verification only aplly when user is admin
      if (this.data.isAdmin) {
        
        // Verify if team is already join to a team
        if (this.data.team.get('tournaments').length === 0) {
          this.loadSection('joinTournament', prevSection);
          return;
        }

        // Check if must be show invite player modal
        debug(this.data.team.get('tours'));
        if (!this.data.team.get('tours')['playerInvitation']) {
          this.inviteModal();
          return;
        }
      }
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.headerRegion.show( this.header );
    },
    
    onShow: function() {
      debug( 'displayed' );
      this.loadSection( 'wall' );

      this.verifyTeamComplete( 'wall' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return layout definition as module export
  module.exports = TeamLayout;
});

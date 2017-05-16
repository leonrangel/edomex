define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:player:team:views:members' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var MemberCell = require( './membersCell' );
  
  // View definition
  var TeamMembers = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/members.hbs' ) ),
    childView: MemberCell,
    childViewContainer: 'div.team-members-list div.cols-16',
    
    ui: {
      'inviteBtn': 'button.invite'
    },
    
    triggers: {
      'click @ui.inviteBtn': 'modal:invite'
    },
    
    initialize: function( options ) {
      debug( 'initializing' );
      this.isAdmin   = options.isAdmin;
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      this.ui.inviteBtn.hide();
      if( this.isAdmin ) {
        this.ui.inviteBtn.show();
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
  
  // View definition as module export
  module.exports = TeamMembers;
});
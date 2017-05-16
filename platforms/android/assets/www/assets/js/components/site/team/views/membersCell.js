define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:team:views:membersCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var MemberCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/membersCell.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },
    
    serializeModel: function( model ) {
      // Override the default method to add an extra computed value
      // for the model data
      var data = model.toJSON.apply( model, _.rest( arguments ) );
      data.fullName = data.name + ' ' + data.lastnameFather;
      return data;
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
  
  // View definition as module export
  module.exports = MemberCell;
});
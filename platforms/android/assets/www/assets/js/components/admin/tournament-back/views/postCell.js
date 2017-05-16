define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:postCell' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var PostCell = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/postCell.hbs' ) ),
    tagName: 'li',
    
    ui: {
      'edit'   : 'span.edit',
      'delete' : 'span.delete'
    },
    
    triggers: {
      'click @ui.edit'   : 'edit',
      'click @ui.delete' : 'delete'
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
  module.exports = PostCell;
});
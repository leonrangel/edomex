define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'models:collection:users' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var UserModel = require( './user' );
  
  // Collection definition
  var UsersCollection = Valkie.Collection.extend({
    model: UserModel
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Collection definition as module export
  module.exports = UsersCollection;
});

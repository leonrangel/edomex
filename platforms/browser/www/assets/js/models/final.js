define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'models:final' );

  // Module dependencies
  var Valkie = require( 'valkie' );

  // Model definition
  var FinalModel = Valkie.Model.extend({
    urlRoot: 'https://www.somosfut.com/final',

    defaults: function() {
      return {
        date       : null,
        uuid       : '',
        league     : '',
        tournament : '',
        teamA      : '',
        teamB      : '',
        results    : {
          filled     : 0,
          goalsA     : [],
          goalsB     : [],
          assistsA   : [],
          assistsB   : [],
          yCardsA    : [],
          yCardsB    : [],
          rCardsA    : [],
          rCardsB    : []
        },
        extras     : {},
        address    : '',
        location   : {
          lat      : '',
          long     : '',
          accuracy : 0
        }
      }
    }
  });

  // Simple exports check
  if( ! exports ) {
    exports = {};
  }

  // Model definition as module export
  module.exports = FinalModel;
});

define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:matchResults' );

  // Module dependencies
  var _ = require( 'underscore' );
  var $ = require( 'jquery' );
  var utils           = require( 'helpers/utils' );
  var Valkie          = require( 'valkie' );
  var UsersCollection = require( 'models/users' );

  // View definition
  var MatchResults = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/matchResults.hbs' ) ),

    behaviors: {
      tooltip: {},
      validator: {
        successHandler: 'submit'
      }
    },

    ui: {
      'form'        : 'form',
      'cancelBtn'   : 'span.cancel',
      'submitBtn'   : 'span.save',
      'resetBtn'    : 'span.clear',
      'goalsA'      : 'input[name="goalsA"]',
      'goalsAList'  : 'ul.goalsA',
      'rCardsA'     : 'input[name="rCardsA"]',
      'rCardsAList' : 'ul.rCardsA',
      'yCardsA'     : 'input[name="yCardsA"]',
      'yCardsAList' : 'ul.yCardsA',
      'goalsB'      : 'input[name="goalsB"]',
      'goalsBList'  : 'ul.goalsB',
      'rCardsB'     : 'input[name="rCardsB"]',
      'rCardsBList' : 'ul.rCardsB',
      'yCardsB'     : 'input[name="yCardsB"]',
      'yCardsBList' : 'ul.yCardsB',

      'dynPointsB'     : 'input[name="dynPointsB"]',
      'dynPointsA'     : 'input[name="dynPointsA"]',
      'dynPointsStrB'     : 'input[name="dynPointsStrB"]',
      'dynPointsStrA'     : 'input[name="dynPointsStrA"]'
    },

    triggers: {
      'click @ui.cancelBtn': 'done'
    },

    events: {
      'click @ui.submitBtn' : 'submit',
      'click @ui.resetBtn'  : 'clear',
      'change @ui.goalsA'   : function() {
        var options = { length: this.ui.goalsA.val() };
        this.updateSection( this.ui.goalsAList, this.goalsAElement( options ) );
      },
      'change @ui.rCardsA'  : function() {
        var options = { length: this.ui.rCardsA.val() };
        this.updateSection( this.ui.rCardsAList, this.rCardsAElement( options ) );
      },
      'change @ui.yCardsA'  : function() {
        var options = { length: this.ui.yCardsA.val() };
        this.updateSection( this.ui.yCardsAList, this.yCardsAElement( options ) );
      },
      'change @ui.goalsB'   : function() {
        var options = { length: this.ui.goalsB.val() };
        this.updateSection( this.ui.goalsBList, this.goalsBElement( options ) );
      },
      'change @ui.rCardsB'  : function() {
        var options = { length: this.ui.rCardsB.val() };
        this.updateSection( this.ui.rCardsBList, this.rCardsBElement( options ) );
      },
      'change @ui.yCardsB'  : function() {
        var options = { length: this.ui.yCardsB.val() };
        this.updateSection( this.ui.yCardsBList, this.yCardsBElement( options ) );
      }
    },

    initialize: function( options ) {
      this.options = options;

      // Load additional templates
      this.goalTpl = Valkie.template( require( 'text!./templates/matchResultsGoal.hbs' ) );
      this.cardTpl = Valkie.template( require( 'text!./templates/matchResultsCard.hbs' ) );

      // Retrieve players for teamA
      this.playersA = new UsersCollection();
      this.playersA.url = 'https://www.somosfut.com/team/' + options.match.attributes.teamA._id + '/members';
      this.playersA.fetch( { async: false } );

      // Retrieve players for teamB
      this.playersB = new UsersCollection();
      this.playersB.url = 'https://www.somosfut.com/team/' + options.match.attributes.teamB._id + '/members';
      this.playersB.fetch( { async: false } );

      this.addGoalsFunctions();
      this.addCardsFunctions();
    },

    addCardsFunctions: function() {
      // Generate functions that retrieve a new element according to rCardsA/B and
      // yCardsA/B
      var self             = this
      var teamsIdentifiers = [ 'A', 'B' ];
      var colors           = [ 'r', 'y' ];
      // Add rCardsAElement, yCardsAElement, rCardsBElement and yCardsBElement
      _.each( teamsIdentifiers, function ( identifier ) {
        _.each( colors, function( color ) {
          self[color + 'Cards' + identifier + 'Element'] = function ( options ) {
            if ( typeof ( options.length ) === 'string' ) {
              var values = self.generateEmptyArray( options.length );
            } else if ( ! options.values instanceof Array ) {
              var values = []
            } else {
              var values = options.values;
            }

            var elements = _.map(values, function( value ) {
              return self.cardTpl({
                name: color + 'Cards' + identifier + '[]',
                players: self['players' + identifier].toJSON(),
                value: value
              });
            });

            return elements;
          }
        });
      });
    },

    addGoalsFunctions: function() {
      // Generate functions that retrieve a new element according to goalsA/B
      var self             = this
      var teamsIdentifiers = [ 'A', 'B' ];

      // Add goalsAElement and goalsBElement;
      _.each( teamsIdentifiers, function ( identifier ) {
        self['goals' + identifier + 'Element'] = function ( options ) {
          if ( typeof ( options.length ) === 'string' ) {
            var assistants = self.generateEmptyArray( options.length );
            var values     = self.generateEmptyArray( options.length );
          } else if ( ! options.values instanceof Array ) {
            var values     = [];
            var assistents = [];
          } else {
            var values     = options.values;
            var assistants = options.assistants;
          }

          var elements = _.map(values, function ( value ) {
            if ( value !== undefined ) {
              var index      = _.indexOf( values, value  );
              var assistedBy = assistants[index];
            } else {
              var assistedBy = undefined;
            }

            return self.goalTpl({
              team: identifier,
              players: self['players' + identifier].toJSON(),
              value: value,
              assistedBy: assistedBy
            });
          });

          return elements;
        }
      });
    },

    render: function() {
      debug( 'rendering' );
      var data = {
        match: this.options.match.attributes
      };

      this.setElement( this.template( data ) );
      this.bindUIElements();

      if( data.match.results.filled ) {
        this.unpackData( data.match.results );
      }

      return this;
    },

    updateSection: function( section, elements ) {
      debug( 'update section' );
      section.empty();
      for( var i = 0; i < elements.length; i++ ) {
        section.append( elements[i] );
      }
    },

    unpackData: function( results ) {
      debug( 'load previously stored data: %o', results );
      for( var k in results ) {
        if( results.hasOwnProperty( k ) && results[ k ] instanceof Array ) {
          if( this.ui[ k ] ) {
            this.ui[ k ].val( results[ k ].length );

            var options = {
              values: results[k],
              assistants: this.getAssistants(results, k)
            };
            var elements = this[k + 'Element']( options );
            this.updateSection( this.ui[ k + 'List'], elements );
          }
        }
      }
    },

    getAssistants: function (results, k) {
      var teamIdentifier = k.slice(-1);
      return results['assists' + teamIdentifier];
    },

    generateEmptyArray: function( length ) {
      var array = []
      for ( var i = 0; i < length; i++ ) {
        array.push( undefined );
      }
      return array;
    },

    clear: function() {
      this.ui.goalsA.val( '' );
      this.ui.rCardsA.val( '' );
      this.ui.yCardsA.val( '' );
      this.ui.goalsB.val( '' );
      this.ui.rCardsB.val( '' );
      this.ui.yCardsB.val( '' );
      this.ui.dynPointsStrB.val('');
      this.ui.dynPointsStrA.val('');
      this.ui.dynPointsB.val(0);
      this.ui.dynPointsA.val(0);
    },

    submit: function() {
      // Process results form data
      var results = {};
      results.filled = 1;
      this.ui.form.serializeArray().forEach( function( el ) {
        // Look for arrays
        if( el.name.indexOf( '[]' ) > -1 ) {
          el.name = el.name.substring( 0, el.name.indexOf( '[]' ) );
          if( ! _.has( results, el.name ) ) {
            results[ el.name ] = [];
          }

          // Set null as values instead of string
          if( el.value === 'null' ) {
            el.value = null;
          }

          // Set value
          results[ el.name ].push( el.value );
        }
      });

      results.dynPointsStrB = this.ui.dynPointsStrB.val();
      results.dynPointsStrA = this.ui.dynPointsStrA.val();
      results.dynPointsB = this.ui.dynPointsB.val();
      results.dynPointsA = this.ui.dynPointsA.val();


      // Use default values for undefined items
      _.defaults( results, {
        filled     : 0,
        goalsA     : [],
        goalsB     : [],
        assistsA   : [],
        assistsB   : [],
        yCardsA    : [],
        yCardsB    : [],
        rCardsA    : [],
        rCardsB    : [],

        dynPointsStrB : '',
        dynPointsStrA : '',
        dynPointsB : 0,
        dynPointsA : 0
      });

      // Save results and exit
      debug( 'storing results information: %o', results );
      this.options.match.set( 'results', results );
      this.options.match.save(null, {
        error: function() {
          utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
        },
        success:function() {
          utils.message( 'success', 'OK', 'CHANGES_STORED' );
        }
      });

      this.trigger( 'done' );
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
  module.exports = MatchResults;
});
